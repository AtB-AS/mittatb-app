import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  Dimensions,
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
import {StyleSheet, useTheme} from '../../theme';
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
import {NoResultReason, SearchStateType} from './types';
import FavoriteChips from '../../favorite-chips';

import Animated, {Easing} from 'react-native-reanimated';
import Bugsnag from '@bugsnag/react-native';
import {ErrorType, getAxiosErrorType} from '../../api/utils';
import {screenReaderPause} from '../../components/accessible-text';
import ThemeIcon from '../../components/theme-icon';
import ScreenReaderAnnouncement from '../../components/screen-reader-announcement';
import ThemeText from '../../components/text';
import FadeBetween from './FadeBetween';

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
  const {theme} = useTheme();
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
    timeOfLastSearch,
    reload,
    clearPatterns,
    searchState,
    errorType,
  ] = useTripPatterns(from, to, date);
  const isSearching = searchState === 'searching';
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
    (_, isParentAnimating) => (
      <View>
        <SearchGroup>
          <View style={styles.searchButtonContainer}>
            <View style={styles.styleButton}>
              <LocationButton
                accessible={true}
                accessibilityLabel={'Velg avreisested' + screenReaderPause}
                accessibilityHint={
                  'Aktiver for å søke etter adresse eller sted.' +
                  screenReaderPause
                }
                accessibilityRole="button"
                title="Fra"
                placeholder={
                  updatingLocation
                    ? 'Oppdaterer posisjon'
                    : 'Søk etter adresse eller sted'
                }
                icon={
                  updatingLocation && !from ? (
                    <ActivityIndicator color={theme.text.colors.primary} />
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
              <ThemeIcon svg={CurrentLocationArrow} />
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

            <TouchableOpacity
              onPress={swap}
              hitSlop={insets.all(12)}
              accessible={true}
              accessibilityLabel={
                'Bytt avreisested og ankomststed' + screenReaderPause
              }
              accessibilityRole="button"
            >
              <ThemeIcon svg={Swap} />
            </TouchableOpacity>
          </View>
        </SearchGroup>

        <FadeBetween
          visibleKey={isHeaderFullHeight ? 'dateInput' : 'favoriteChips'}
        >
          <FavoriteChips
            key="favoriteChips"
            chipTypes={['favorites', 'add-favorite']}
            onSelectLocation={fillNextAvailableLocation}
            containerStyle={[
              styles.fadeChild,
              {marginLeft: theme.spacings.medium},
            ]}
            chipActionHint={
              'Aktiver for å bruke som ' +
              (from ? 'destinasjon' : 'avreisested') +
              screenReaderPause
            }
          />
          <SearchGroup containerStyle={styles.fadeChild} key="dateInput">
            <DateInput
              onDateSelected={setDate}
              value={date}
              timeOfLastSearch={timeOfLastSearch}
            />
          </SearchGroup>
        </FadeBetween>
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
      <ThemeText
        type="paragraphHeadline"
        style={[
          styles.altTitleText,
          styles.altTitleText__right,
          {maxWidth: altWidth / 2},
        ]}
        numberOfLines={1}
      >
        {from?.name}
      </ThemeText>
      <ThemeText
        type="paragraphHeadline"
        accessibilityLabel="til"
        style={styles.altTitleText}
      >
        {' '}
        –{' '}
      </ThemeText>
      <ThemeText
        type="paragraphHeadline"
        style={[styles.altTitleText, {maxWidth: altWidth / 2}]}
        numberOfLines={1}
      >
        {to?.name}
      </ThemeText>
    </View>
  );

  const noResultReasons = computeNoResultReasons(date, from, to);

  const onPressed = useCallback(
    (tripPattern) =>
      navigation.navigate('TripDetailsModal', {
        from: from!,
        to: to!,
        tripPatternId: tripPattern.id!,
        tripPattern: tripPattern,
      }),
    [navigation, from, to],
  );

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
      <ScreenReaderAnnouncement message={translateSearchState(searchState)} />
      <Results
        tripPatterns={tripPatterns}
        isSearching={isSearching}
        showEmptyScreen={showEmptyScreen}
        isEmptyResult={isEmptyResult}
        resultReasons={noResultReasons}
        onDetailsPressed={onPressed}
        errorType={errorType}
      />
    </DisappearingHeader>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  searchButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacings.medium,
  },
  styleButton: {
    flexGrow: 1,
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
  },
  altTitleText__right: {
    textAlign: 'right',
  },
  fadeChild: {
    marginVertical: theme.spacings.small,
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
): [
  TripPattern[] | null,
  Date,
  () => {},
  () => void,
  SearchStateType,
  ErrorType?,
] {
  const [timeOfSearch, setTimeOfSearch] = useState<Date>(new Date());
  const [tripPatterns, setTripPatterns] = useState<TripPattern[] | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>();
  const [searchState, setSearchState] = useState<SearchStateType>('idle');

  const clearPatterns = () => setTripPatterns(null);
  const reload = useCallback(() => {
    const source = CancelToken.source();

    async function search() {
      if (!fromLocation || !toLocation) return;

      setSearchState('searching');
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
        setTimeOfSearch(searchDate);
        if (Array.isArray(response.data)) {
          setTripPatterns(response.data);
          setSearchState(
            response.data.length >= 1
              ? 'search-success'
              : 'search-empty-result',
          );
        }
      } catch (e) {
        if (!isCancel(e)) {
          setErrorType(getAxiosErrorType(e));
          console.warn(e);
          setTripPatterns(null);
          setSearchState('search-empty-result');
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
    timeOfSearch,
    reload,
    clearPatterns,
    searchState,
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

function log(message: string, metadata?: {[key: string]: string}) {
  Bugsnag.leaveBreadcrumb(message, {component: 'Assistant', ...metadata});
}

function translateLocation(location: Location | undefined): string {
  if (!location) return 'Undefined location';
  return `${location.id}--${location.name}--${location.locality}`;
}
function translateSearchState(
  searchState: SearchStateType,
): string | undefined {
  switch (searchState) {
    case 'searching':
      return 'Laster søkeresultater.';
    case 'search-success':
      return 'Søkeresultater er lastet inn.';
    case 'search-empty-result':
      return 'Fikk ingen søkeresultater.';
    default:
      return;
  }
}
