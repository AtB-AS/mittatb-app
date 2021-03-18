import {CancelToken, isCancel, searchTrip} from '@atb/api';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {Swap} from '@atb/assets/svg/icons/actions';
import {CurrentLocationArrow} from '@atb/assets/svg/icons/places';
import {screenReaderPause} from '@atb/components/accessible-text';
import Button from '@atb/components/button';
import DisappearingHeader from '@atb/components/disappearing-header';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {LocationInput, Section} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import FavoriteChips from '@atb/favorite-chips';
import {useFavorites} from '@atb/favorites';
import {
  Location,
  LocationWithMetadata,
  UserFavorites,
} from '@atb/favorites/types';
import {useReverseGeocoder} from '@atb/geocoder';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {useLocationSearchValue} from '@atb/location-search';
import {SelectableLocationData} from '@atb/location-search/types';
import {RootStackParamList} from '@atb/navigation';
import {TripPattern} from '@atb/sdk';
import {useSearchHistory} from '@atb/search-history';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  AssistantTexts,
  dictionary,
  Language,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime, isInThePast} from '@atb/utils/date';
import {
  locationDistanceInMetres as distanceInMetres,
  locationsAreEqual,
  LOCATIONS_REALLY_CLOSE_THRESHOLD,
} from '@atb/utils/location';
import {useLayout} from '@atb/utils/use-layout';
import Bugsnag from '@bugsnag/react-native';
import {TFunc} from '@leile/lobo-t';
import analytics from '@react-native-firebase/analytics';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {AssistantParams} from '.';
import Loading from '../Loading';
import FadeBetween from './FadeBetween';
import {SearchTime, useSearchTimeValue} from './journey-date-picker';
import NewsBanner from './NewsBanner';
import Results from './Results';
import {NoResultReason, SearchStateType} from './types';

type AssistantRouteName = 'AssistantRoot';
const AssistantRouteNameStatic: AssistantRouteName = 'AssistantRoot';

export type AssistantScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AssistantParams>,
  StackNavigationProp<RootStackParamList>
>;

type AssistantRouteProp = RouteProp<AssistantParams, AssistantRouteName>;

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

  const {closestLocation: currentLocation} = useReverseGeocoder(
    location?.coords ?? null,
  );

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
  const {language, t} = useTranslation();
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

  const searchTime = useSearchTimeValue('searchTime', {
    option: 'now',
    date: new Date().toISOString(),
  });

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

  function onSearchTimePress() {
    navigation.navigate('DateTimePicker', {
      callerRouteName: 'AssistantRoot',
      callerRouteParam: 'searchTime',
      searchTime,
    });
  }

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

  const [
    tripPatterns,
    timeOfLastSearch,
    reload,
    clearPatterns,
    searchState,
    error,
  ] = useTripPatterns(from, to, searchTime);
  const isSearching = searchState === 'searching';
  const openLocationSearch = (
    callerRouteParam: keyof AssistantRouteProp['params'],
    initialLocation: LocationWithMetadata | undefined,
  ) =>
    navigation.navigate('LocationSearch', {
      label:
        callerRouteParam === 'fromLocation'
          ? t(AssistantTexts.location.departurePicker.label)
          : t(AssistantTexts.location.destinationPicker.label),
      callerRouteName: AssistantRouteNameStatic,
      callerRouteParam,
      initialLocation,
      includeJourneyHistory: true,
    });

  const showEmptyScreen = !tripPatterns && !isSearching && !error;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const useScroll = (!showEmptyScreen && !isEmptyResult) || !!error;
  const isHeaderFullHeight = !from || !to;

  const renderHeader = useCallback(
    (_) => (
      <View>
        <View style={styles.paddedContainer}>
          <Section>
            <LocationInput
              accessibilityLabel={
                t(AssistantTexts.location.departurePicker.a11yLabel) +
                screenReaderPause
              }
              accessibilityHint={
                t(AssistantTexts.location.departurePicker.a11yHint) +
                screenReaderPause
              }
              updatingLocation={updatingLocation && !to}
              location={from}
              label={t(AssistantTexts.location.departurePicker.label)}
              onPress={() => openLocationSearch('fromLocation', from)}
              icon={<ThemeIcon svg={CurrentLocationArrow} />}
              onIconPress={setCurrentLocationOrRequest}
              iconAccessibility={{
                accessible: true,
                accessibilityLabel:
                  from?.resultType == 'geolocation'
                    ? t(AssistantTexts.location.locationButton.a11yLabel.update)
                    : t(AssistantTexts.location.locationButton.a11yLabel.use),
                accessibilityRole: 'button',
              }}
            />

            <LocationInput
              accessibilityLabel={t(
                AssistantTexts.location.destinationPicker.a11yLabel,
              )}
              label={t(AssistantTexts.location.destinationPicker.label)}
              location={to}
              onPress={() => openLocationSearch('toLocation', to)}
              icon={<ThemeIcon svg={Swap} />}
              onIconPress={swap}
              iconAccessibility={{
                accessible: true,
                accessibilityLabel:
                  t(AssistantTexts.location.swapButton.a11yLabel) +
                  screenReaderPause,
                accessibilityRole: 'button',
              }}
            />
          </Section>
        </View>

        <FadeBetween
          visibleKey={isHeaderFullHeight ? 'favoriteChips' : 'dateInput'}
        >
          <FavoriteChips
            key="favoriteChips"
            chipTypes={['favorites', 'add-favorite']}
            onSelectLocation={fillNextAvailableLocation}
            containerStyle={styles.fadeChild}
            contentContainerStyle={{
              // @TODO Find solution for not hardcoding this. e.g. do proper math
              paddingLeft: theme.spacings.medium,
              paddingRight: theme.spacings.medium / 2,
            }}
            chipActionHint={
              t(AssistantTexts.favorites.favoriteChip.a11yHint) +
              t(!!from ? dictionary.toPlace : dictionary.fromPlace) +
              screenReaderPause
            }
          />
          <View
            style={[styles.paddedContainer, styles.fadeChild]}
            key="dateInput"
          >
            <Button
              text={getSearchTimeLabel(
                searchTime,
                timeOfLastSearch,
                t,
                language,
              )}
              color="secondary_3"
              onPress={onSearchTimePress}
            />
          </View>
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
  const noResultReasons = computeNoResultReasons(searchTime, from, to);

  const onPressed = useCallback(
    (tripPatternId, tripPatterns, startIndex) =>
      navigation.navigate('TripDetails', {
        tripPatternId,
        tripPatterns,
        startIndex,
      }),
    [navigation, from, to],
  );

  const newsBanner = <NewsBanner />;

  const [searchStateMessage, setSearchStateMessage] = useState<
    string | undefined
  >();

  useEffect(() => {
    switch (searchState) {
      case 'searching':
        setSearchStateMessage(t(AssistantTexts.searchState.searching));
        break;
      case 'search-success':
        setSearchStateMessage(t(AssistantTexts.searchState.searchSuccess));
        break;
      case 'search-empty-result':
        setSearchStateMessage(t(AssistantTexts.searchState.searchEmptyResult));
        break;
      default:
        break;
    }
  }, [searchState]);

  return (
    <DisappearingHeader
      renderHeader={renderHeader}
      highlightComponent={newsBanner}
      onRefresh={reload}
      isRefreshing={isSearching}
      useScroll={useScroll}
      headerTitle={t(AssistantTexts.header.title)}
      headerMargin={24}
      isFullHeight={isHeaderFullHeight}
      alternativeTitleComponent={altHeaderComp}
      leftButton={{
        type: 'home',
        onPress: resetView,
        accessibilityLabel: t(AssistantTexts.header.accessibility.logo),
      }}
      onFullscreenTransitionEnd={(fullHeight) => {
        if (fullHeight) {
          clearPatterns();
        }
      }}
    >
      <ScreenReaderAnnouncement message={searchStateMessage} />
      <Results
        tripPatterns={tripPatterns}
        isSearching={isSearching}
        showEmptyScreen={showEmptyScreen}
        isEmptyResult={isEmptyResult}
        resultReasons={noResultReasons}
        onDetailsPressed={onPressed}
        errorType={error}
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
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
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
  paddedContainer: {
    marginHorizontal: theme.spacings.medium,
  },
  fadeChild: {
    marginVertical: theme.spacings.medium,
  },
}));

type SearchForLocations = {
  from?: LocationWithMetadata;
  to?: LocationWithMetadata;
};

function computeNoResultReasons(
  date?: SearchTime,
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

  const isPastDate = date && date?.option !== 'now' && isInThePast(date.date);

  if (isPastDate) {
    const isArrival = date?.option === 'arrival';
    const dateReason = isArrival
      ? NoResultReason.PastArrivalTime
      : NoResultReason.PastDepartureTime;
    reasons.push(dateReason);
  }
  return reasons;
}

function useLocations(
  currentLocation: Location | undefined,
): SearchForLocations {
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

  return useUpdatedLocation(
    searchedFromLocation,
    searchedToLocation,
    memoedCurrentLocation,
    favorites,
  );
}

function useUpdatedLocation(
  searchedFromLocation: SelectableLocationData | undefined,
  searchedToLocation: SelectableLocationData | undefined,
  currentLocation: SelectableLocationData | undefined,
  favorites: UserFavorites,
): SearchForLocations {
  type Directions = 'from' | 'to' | 'from-to';
  type SearchForLocationsWithDirections = {
    direction: Directions;
  } & SearchForLocations;

  const getLocation = useCallback(
    (
      direction: 'from' | 'to',
      searchedLocation?: SelectableLocationData,
    ): SearchForLocationsWithDirections => {
      if (!searchedLocation) return {direction};

      switch (searchedLocation.resultType) {
        case 'search':
          return {
            direction,
            [direction]: searchedLocation,
          };
        case 'geolocation':
          return {
            direction,
            [direction]: currentLocation,
          };
        case 'journey': {
          const toSearch = (i: number): LocationWithMetadata => ({
            ...searchedLocation.journeyData[i],
            resultType: 'search',
          });
          return {
            direction: 'from-to',
            from: toSearch(0),
            to: toSearch(1),
          };
        }
        case 'favorite':
          const favorite = favorites.find(
            (f) => f.id === searchedLocation.favoriteId,
          );

          if (favorite) {
            return {
              direction: direction,
              [direction]: {
                ...favorite.location,
                resultType: 'favorite',
                favoriteId: favorite.id,
              },
            };
          }
      }

      return {direction};
    },
    [currentLocation, favorites],
  );

  const newFrom = useMemo(() => getLocation('from', searchedFromLocation), [
    searchedFromLocation,
    getLocation,
  ]);
  const newTo = useMemo(() => getLocation('to', searchedToLocation), [
    searchedToLocation,
    getLocation,
  ]);

  // Prefer new from/to in the To field.
  if (newTo.direction === 'from-to') {
    return newTo;
  }
  // If from input contains both from/to
  if (newFrom.direction === 'from-to') {
    return newFrom;
  }

  // We don't have any entire journey selection. Just merge from/to:
  return {
    ...newTo,
    ...newFrom,
  };
}

export default AssistantRoot;

function useTripPatterns(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: SearchTime | undefined,
): [
  TripPattern[] | null,
  string,
  () => {},
  () => void,
  SearchStateType,
  ErrorType?,
] {
  const [timeOfSearch, setTimeOfSearch] = useState<string>(
    new Date().toISOString(),
  );
  const [tripPatterns, setTripPatterns] = useState<TripPattern[] | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>();
  const [searchState, setSearchState] = useState<SearchStateType>('idle');
  const {addJourneySearchEntry} = useSearchHistory();

  const clearPatterns = () => setTripPatterns(null);
  const reload = useCallback(() => {
    const source = CancelToken.source();

    async function search() {
      if (!fromLocation || !toLocation) return;

      setSearchState('searching');
      setErrorType(undefined);
      try {
        const arriveBy = searchTime?.option === 'arrival';
        const searchDate =
          searchTime && searchTime?.option !== 'now'
            ? searchTime.date
            : new Date().toISOString();

        log('searching', {
          fromLocation: translateLocation(fromLocation),
          toLocation: translateLocation(toLocation),
          searchDate: searchDate,
        });

        try {
          // Fire and forget add journey search entry
          await addJourneySearchEntry([fromLocation, toLocation]);
        } catch (e) {}

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
  }, [fromLocation, toLocation, searchTime]);

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

function getSearchTimeLabel(
  searchTime: SearchTime,
  timeOfLastSearch: string,
  t: TFunc<typeof Language>,
  language: Language,
) {
  const date = searchTime.option === 'now' ? timeOfLastSearch : searchTime.date;
  const time = formatToLongDateTime(date, language);

  switch (searchTime.option) {
    case 'now':
      return t(AssistantTexts.dateInput.departureNow(time));
    case 'arrival':
      return t(AssistantTexts.dateInput.arrival(time));
    case 'departure':
      return t(AssistantTexts.dateInput.departure(time));
  }
  return time;
}
