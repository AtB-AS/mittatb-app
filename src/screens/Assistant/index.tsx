import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {searchTrip} from '../../api';
import {CancelToken, isCancel} from '../../api/client';
import {Swap} from '../../assets/svg/icons/actions';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import DisappearingHeader from '../../components/disappearing-header';
import {LocationButton} from '../../components/search-button';
import SearchGroup from '../../components/search-button/search-group';
import {useFavorites} from '../../favorites/FavoritesContext';
import {
  Location,
  LocationWithMetadata,
  UserFavorites,
} from '../../favorites/types';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '../../GeolocationContext';
import {useLocationSearchValue} from '../../location-search';
import {RootStackParamList} from '../../navigation';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import {TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import {
  locationDistanceInMetres as distanceInMetres,
  locationsAreEqual,
  LOCATIONS_REALLY_CLOSE_THRESHOLD,
} from '../../utils/location';
import {useReverseGeocoder} from '../../geocoder';
import {useLayout} from '../../utils/use-layout';
import Loading from '../Loading';
import DateInput, {DateOutput} from './DateInput';
import Results from './Results';
import {NoResultReason} from './types';
import FavoriteChips from '../../favorite-chips';

import Animated, {Easing} from 'react-native-reanimated';
import Bugsnag from '@bugsnag/react-native';
import {ErrorType, getAxiosErrorType} from '../../api/utils';
import AccessibleText, {
  screenreaderPause,
} from '../../components/accessible-text';
import colors from '../../theme/colors';

type AssistantRouteName = 'Assistant';
const AssistantRouteNameStatic: AssistantRouteName = 'Assistant';

export type AssistantScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TabNavigatorParams, AssistantRouteName>,
  StackNavigationProp<RootStackParamList>
>;

type AssistantRouteProp = RouteProp<TabNavigatorParams, AssistantRouteName>;

type RootProps = {
  navigation: AssistantScreenNavigationProp;
  route: AssistantRouteProp;
};

const AssistantRoot: React.FC<RootProps> = ({navigation}) => {
  const {
    status,
    locationEnabled,
    location,
    requestPermission: requestGeoPermission,
  } = useGeolocationState();

  const {locations: reverseLookupLocations} =
    useReverseGeocoder(location?.coords ?? null) ?? [];
  const currentLocation = reverseLookupLocations?.length
    ? reverseLookupLocations[1]
    : undefined;

  if (!status) {
    return <Loading />;
  }

  return (
    <Assistant
      currentLocation={currentLocation}
      hasLocationPermission={locationEnabled && status === 'granted'}
      navigation={navigation}
      requestGeoPermission={requestGeoPermission}
    />
  );
};

type Props = {
  currentLocation?: Location;
  hasLocationPermission: boolean;
  requestGeoPermission: RequestPermissionFn;
  navigation: AssistantScreenNavigationProp;
};

const Assistant: React.FC<Props> = ({
  currentLocation,
  hasLocationPermission,
  requestGeoPermission,
  navigation,
}) => {
  const styles = useStyles();
  const {from, to} = useLocations(currentLocation);

  function swap() {
    log('swap', {
      newFrom: translateLocation(to),
      newTo: translateLocation(from),
    });
    navigation.setParams({fromLocation: to, toLocation: from});
  }

  function fillNextAvailableLocation(selectedLocation: LocationWithMetadata) {
    if (!from) {
      navigation.setParams({
        fromLocation: selectedLocation,
        toLocation: to,
      });
    } else {
      navigation.setParams({
        fromLocation: from,
        toLocation: selectedLocation,
      });
    }
  }

  function setCurrentLocationAsFrom() {
    log('set_current_location_as_from');
    navigation.setParams({
      fromLocation: currentLocation && {
        ...currentLocation,
        resultType: 'geolocation',
      },
      toLocation: to,
    });
  }

  const [updatingLocation, setUpdatingLocation] = useState<boolean>(false);

  useDoOnceWhen(
    () => setUpdatingLocation(true),
    !Boolean(currentLocation) && hasLocationPermission,
  );
  useDoOnceWhen(
    () => setUpdatingLocation(false),
    Boolean(currentLocation) && hasLocationPermission,
  );

  useDoOnceWhen(setCurrentLocationAsFrom, Boolean(currentLocation));

  async function setCurrentLocationOrRequest() {
    if (currentLocation) {
      setCurrentLocationAsFrom();
    } else {
      const status = await requestGeoPermission();
      if (status === 'granted') {
        setCurrentLocationAsFrom();
      }
    }
  }

  function resetView() {
    analytics().logEvent('click_logo_reset');
    log('reset');
    setCurrentLocationOrRequest();

    navigation.setParams({
      toLocation: undefined,
    });
  }

  const [date, setDate] = useState<DateOutput | undefined>();
  const [
    tripPatterns,
    isSearching,
    timeOfLastSearch,
    reload,
    clearPatterns,
    errorType,
  ] = useTripPatterns(from, to, date);

  const openLocationSearch = (
    callerRouteParam: keyof AssistantRouteProp['params'],
    initialLocation: LocationWithMetadata | undefined,
  ) =>
    navigation.navigate('LocationSearch', {
      label: callerRouteParam === 'fromLocation' ? 'Fra' : 'Til',
      callerRouteName: AssistantRouteNameStatic,
      callerRouteParam,
      initialLocation,
    });

  const showEmptyScreen = !tripPatterns && !isSearching && !errorType;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const useScroll = (!showEmptyScreen && !isEmptyResult) || !!errorType;
  const isHeaderFullHeight = !from || !to;

  const renderHeader = useCallback(
    () => (
      <View>
        <SearchGroup>
          <View style={styles.searchButtonContainer}>
            <View style={styles.styleButton}>
              <LocationButton
                accessible={true}
                accessibilityLabel={'Velg avreisested' + screenreaderPause}
                accessibilityHint={
                  'Aktiver for å søke etter adresse eller sted.' +
                  screenreaderPause
                }
                accessibilityRole="button"
                title="Test"
                placeholder={
                  updatingLocation
                    ? 'Oppdaterer posisjon'
                    : 'Søk etter adresse eller sted'
                }
                icon={
                  updatingLocation && !from ? (
                    <ActivityIndicator color={colors.general.gray200} />
                  ) : undefined
                }
                location={from}
                onPress={() => openLocationSearch('fromLocation', from)}
              />
            </View>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel={
                from?.resultType == 'geolocation'
                  ? 'Oppdater posisjon.'
                  : 'Bruk posisjon som avreisested.'
              }
              accessibilityRole="button"
              hitSlop={insets.all(12)}
              onPress={setCurrentLocationOrRequest}
            >
              <CurrentLocationArrow />
            </TouchableOpacity>
          </View>

          <View style={styles.searchButtonContainer}>
            <View style={styles.styleButton}>
              <LocationButton
                accessible={true}
                accessibilityLabel="Velg ankomststed."
                accessibilityRole="button"
                title="Til"
                placeholder="Søk etter adresse eller sted"
                location={to}
                onPress={() => openLocationSearch('toLocation', to)}
              />
            </View>

            <View style={styles.swapButton}>
              <TouchableOpacity
                onPress={swap}
                hitSlop={insets.all(12)}
                accessible={true}
                accessibilityLabel={
                  'Bytt avreisested og ankomststed' + screenreaderPause
                }
                accessibilityRole="button"
              >
                <Swap />
              </TouchableOpacity>
            </View>
          </View>
        </SearchGroup>

        <View style={{height: 40, position: 'relative'}}>
          <Fade
            visible={isHeaderFullHeight}
            style={{position: 'absolute', width: '100%'}}
          >
            <FavoriteChips
              chipTypes={['favorites', 'add-favorite']}
              onSelectLocation={fillNextAvailableLocation}
              containerStyle={styles.chipBox}
              chipActionHint={
                'Aktiver for å bruke som ' +
                (from ? 'destinasjon' : 'avreisested') +
                screenreaderPause
              }
            />
          </Fade>

          <Fade
            visible={!isHeaderFullHeight}
            style={{position: 'absolute', width: '100%'}}
          >
            <SearchGroup containerStyle={{marginTop: 2}}>
              <DateInput
                onDateSelected={setDate}
                value={date}
                timeOfLastSearch={timeOfLastSearch}
              />
            </SearchGroup>
          </Fade>
          <View accessible={true} accessibilityLiveRegion="polite">
            <AccessibleText
              prefix={
                isSearching ? 'Laster søkeresultat' : 'Søkeresultat innlastet'
              }
            />
          </View>
        </View>
      </View>
    ),
    [
      swap,
      isHeaderFullHeight,
      setCurrentLocationOrRequest,
      from,
      to,
      fillNextAvailableLocation,
    ],
  );

  const {onLayout: onAltLayout, width: altWidth} = useLayout();

  const altHeaderComp = (
    <View accessible={true} onLayout={onAltLayout} style={styles.altTitle}>
      <Text
        style={[
          styles.altTitleText,
          styles.altTitleText__right,
          {maxWidth: altWidth / 2},
        ]}
        numberOfLines={1}
      >
        {from?.name}
      </Text>
      <Text accessibilityLabel="til" style={styles.altTitleText}>
        {' '}
        –{' '}
      </Text>
      <Text
        style={[styles.altTitleText, {maxWidth: altWidth / 2}]}
        numberOfLines={1}
      >
        {to?.name}
      </Text>
    </View>
  );

  const noResultReasons = computeNoResultReasons(date, from, to);

  return (
    <DisappearingHeader
      renderHeader={renderHeader}
      onRefresh={reload}
      isRefreshing={isSearching}
      useScroll={useScroll}
      headerTitle="Reiseassistent"
      isFullHeight={isHeaderFullHeight}
      alternativeTitleComponent={altHeaderComp}
      logoClick={{
        callback: resetView,
        accessibilityLabel: 'Nullstill reisesøk',
      }}
      onFullscreenTransitionEnd={(fullHeight) => {
        if (fullHeight) {
          clearPatterns();
        }
      }}
    >
      <Results
        tripPatterns={tripPatterns}
        isSearching={isSearching}
        showEmptyScreen={showEmptyScreen}
        isEmptyResult={isEmptyResult}
        resultReasons={noResultReasons}
        onDetailsPressed={(tripPattern) =>
          navigation.navigate('TripDetailsModal', {
            from: from!,
            to: to!,
            tripPatternId: tripPattern.id!,
            tripPattern: tripPattern,
          })
        }
        errorType={errorType}
      />
    </DisappearingHeader>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  searchButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  swapButton: {
    position: 'relative',
    top: -19,
    right: 23,
    backgroundColor: theme.background.level0,
    padding: 3,
    borderColor: theme.background.accent,
    borderWidth: 2,
    borderRadius: 20,
  },
  styleButton: {
    flexGrow: 1,
  },
  chipBox: {
    marginTop: 8,
    paddingHorizontal: theme.spacings.medium,
  },
  altTitle: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  altTitleText: {
    overflow: 'hidden',
    fontSize: 16,
    fontWeight: 'bold',
  },
  altTitleText__right: {
    textAlign: 'right',
  },
}));

type Locations = {
  from: LocationWithMetadata | undefined;
  to: LocationWithMetadata | undefined;
};

function computeNoResultReasons(
  date?: DateOutput,
  from?: Location,
  to?: Location,
): NoResultReason[] {
  let reasons = [];

  if (!!from && !!to) {
    if (locationsAreEqual(from, to)) {
      reasons.push(NoResultReason.IdenticalLocations);
    } else if (distanceInMetres(from, to) < LOCATIONS_REALLY_CLOSE_THRESHOLD) {
      reasons.push(NoResultReason.CloseLocations);
    }
  }
  const isPastDate = date && date?.type !== 'now' && date?.date < new Date();

  if (isPastDate) {
    const isArrival = date?.type === 'arrival';
    const dateReason = isArrival
      ? NoResultReason.PastArrivalTime
      : NoResultReason.PastDepartureTime;
    reasons.push(dateReason);
  }
  return reasons;
}

function useLocations(currentLocation: Location | undefined): Locations {
  const {favorites} = useFavorites();

  const memoedCurrentLocation = useMemo<LocationWithMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [
      currentLocation?.coordinates.latitude,
      currentLocation?.coordinates.longitude,
    ],
  );

  const searchedFromLocation = useLocationSearchValue<AssistantRouteProp>(
    'fromLocation',
  );
  const searchedToLocation = useLocationSearchValue<AssistantRouteProp>(
    'toLocation',
  );

  const from = useUpdatedLocation(
    searchedFromLocation,
    memoedCurrentLocation,
    favorites,
  );

  const to = useUpdatedLocation(
    searchedToLocation,
    memoedCurrentLocation,
    favorites,
  );

  return {
    from,
    to,
  };
}

function useUpdatedLocation(
  searchedLocation: LocationWithMetadata | undefined,
  currentLocation: LocationWithMetadata | undefined,
  favorites: UserFavorites,
): LocationWithMetadata | undefined {
  return useMemo(() => {
    if (!searchedLocation) return undefined;

    switch (searchedLocation.resultType) {
      case 'search':
        return searchedLocation;
      case 'geolocation':
        return currentLocation;
      case 'favorite':
        const favorite = favorites.find(
          (f) => f.id === searchedLocation.favoriteId,
        );

        if (favorite) {
          return {
            ...favorite.location,
            resultType: 'favorite',
            favoriteId: favorite.id,
          };
        }
    }

    return undefined;
  }, [searchedLocation, currentLocation, favorites]);
}

export default AssistantRoot;

function useTripPatterns(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  date: DateOutput | undefined,
): [TripPattern[] | null, boolean, Date, () => {}, () => void, ErrorType?] {
  const [isSearching, setIsSearching] = useState(false);
  const [timeOfSearch, setTimeOfSearch] = useState<Date>(new Date());
  const [tripPatterns, setTripPatterns] = useState<TripPattern[] | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>();

  const clearPatterns = () => setTripPatterns(null);
  const reload = useCallback(() => {
    const source = CancelToken.source();

    async function search() {
      if (!fromLocation || !toLocation) return;

      setIsSearching(true);
      setErrorType(undefined);
      try {
        const arriveBy = date?.type === 'arrival';
        const searchDate =
          date && date?.type !== 'now' ? date.date : new Date();

        log('searching', {
          fromLocation: translateLocation(fromLocation),
          toLocation: translateLocation(toLocation),
          searchDate: searchDate.toISOString(),
        });

        const response = await searchTrip(
          fromLocation,
          toLocation,
          searchDate,
          arriveBy,
          {
            cancelToken: source.token,
          },
        );
        source.token.throwIfRequested();
        setTripPatterns(response.data);
        setIsSearching(false);
        setTimeOfSearch(searchDate);
      } catch (e) {
        if (!isCancel(e)) {
          setErrorType(getAxiosErrorType(e));
          console.warn(e);
          setTripPatterns(null);
          setIsSearching(false);
        }
      }
    }

    search();
    return () => {
      if (!fromLocation || !toLocation) return;
      source.cancel('New search to replace previous search');
    };
  }, [fromLocation, toLocation, date]);

  useEffect(reload, [reload]);

  return [
    tripPatterns,
    isSearching,
    timeOfSearch,
    reload,
    clearPatterns,
    errorType,
  ];
}

function useDoOnceWhen(fn: () => void, condition: boolean) {
  const firstTimeRef = useRef(true);
  useEffect(() => {
    if (firstTimeRef.current && condition) {
      firstTimeRef.current = false;
      fn();
    }
  }, [condition]);
}

type FadeProps = {
  visible?: boolean;
  style?: StyleProp<Animated.AnimateStyle<ViewStyle>>;
  children?: any;
  duration?: number;
};

function Fade({style, children, visible, duration = 400}: FadeProps) {
  const opacityValue = useRef(new Animated.Value<number>(0)).current;
  const [init, setInit] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    opacityValue.setValue(visible ? 1 : 0);
    setInit(true);
  }, []);

  useEffect(() => {
    if (!init) return;
    return Animated.timing(opacityValue, {
      toValue: visible ? 1 : 0,
      duration: duration,
      easing: Easing.linear,
    }).start(({finished}) => setIsDone(finished));
  }, [visible, init, duration]);

  return (
    <Animated.View style={[{opacity: opacityValue}, style]}>
      {!isDone || visible ? children : null}
    </Animated.View>
  );
}

function log(message: string, metadata?: {[key: string]: string}) {
  Bugsnag.leaveBreadcrumb(message, {component: 'Assistant', ...metadata});
}

function translateLocation(location: Location | undefined): string {
  if (!location) return 'Undefined location';
  return `${location.id}--${location.name}--${location.locality}`;
}
