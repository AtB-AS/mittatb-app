import {Filter, Swap} from '@atb/assets/svg/mono-icons/actions';
import {ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {LocationInputSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {GeoLocation, Location, UserFavorites} from '@atb/favorites/types';
import {useGeolocationState} from '@atb/GeolocationContext';
import {
  SelectableLocationType,
  useLocationSearchValue,
} from '@atb/location-search';
import {
  getSearchTimeLabel,
  SearchTime,
  useSearchTimeValue,
} from '@atb/screens/Dashboard/journey-date-picker';
import Results from '@atb/screens/Dashboard/Results';
import useTripsQuery from '@atb/screens/Dashboard/use-trips-query';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {Language, TripSearchTexts, useTranslation} from '@atb/translations';
import {isInThePast} from '@atb/utils/date';
import {
  coordinatesAreEqual,
  coordinatesDistanceInMetres,
  isValidTripLocations,
  LOCATIONS_REALLY_CLOSE_THRESHOLD,
} from '@atb/utils/location';
import Bugsnag from '@bugsnag/react-native';
import {TFunc} from '@leile/lobo-t';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {DashboardScreenProps} from './types';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {useTravelSearchFiltersEnabled} from '@atb/screens/Dashboard/use-travel-search-filters-enabled';
import storage, {StorageModelKeysEnum} from '@atb/storage';

type TripSearchRouteName = 'TripSearch';
const TripSearchRouteNameStatic: TripSearchRouteName = 'TripSearch';

export type SearchForLocations = {
  from?: Location;
  to?: Location;
};

type RootProps = DashboardScreenProps<'TripSearch'>;

const headerBackgroundColor: StaticColorByType<'background'> =
  'background_accent_0';

const ResultsBackgroundColor: StaticColorByType<'background'> = 'background_1';

const TripSearch: React.FC<RootProps> = ({
  navigation,
  route: {
    params: {callerRoute},
  },
}) => {
  const style = useStyle();
  const {theme} = useTheme();
  const {language, t} = useTranslation();
  const [updatingLocation] = useState<boolean>(false);

  const shouldShowTravelSearchFilterOnboarding =
    useShouldShowTravelSearchFilterOnboarding();
  useEffect(() => {
    if (shouldShowTravelSearchFilterOnboarding) {
      navigation.navigate('TravelSearchFilterOnboardingScreen');
    }
  }, [shouldShowTravelSearchFilterOnboarding]);

  const {location, requestPermission: requestGeoPermission} =
    useGeolocationState();

  const currentLocation = location || undefined;

  const {from, to} = useLocations(currentLocation);
  const searchTime = useSearchTimeValue('searchTime', {
    option: 'now',
    date: new Date().toISOString(),
  });
  const {tripPatterns, timeOfLastSearch, loadMore, searchState, error} =
    useTripsQuery(from, to, searchTime);

  const isSearching = searchState === 'searching';
  const showEmptyScreen = !tripPatterns && !isSearching && !error;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const noResultReasons = computeNoResultReasons(t, searchTime, from, to);
  const isValidLocations = isValidTripLocations(from, to);

  const [searchStateMessage, setSearchStateMessage] = useState<
    string | undefined
  >();

  const screenHasFocus = useIsFocused();

  const travelSearchFiltersEnabled = useTravelSearchFiltersEnabled();

  useEffect(() => {
    if (!screenHasFocus) return;
    switch (searchState) {
      case 'searching':
        setSearchStateMessage(t(TripSearchTexts.searchState.searching));
        break;
      case 'search-success':
        setSearchStateMessage(t(TripSearchTexts.searchState.searchSuccess));
        break;
      case 'search-empty-result':
        setSearchStateMessage(t(TripSearchTexts.searchState.searchEmptyResult));
        break;
      default:
        setSearchStateMessage('');
        break;
    }
  }, [searchState]);

  const setCurrentLocationAsFrom = useCallback(
    function setCurrentLocationAsFrom() {
      log('set_current_location_as_from');
      navigation.setParams({
        fromLocation: currentLocation && {
          ...currentLocation,
          resultType: 'geolocation',
        },
        toLocation: to,
      });
    },
    [navigation, currentLocation, to],
  );

  const openLocationSearch = (
    callerRouteParam: keyof RootProps['route']['params'],
    initialLocation: Location | undefined,
  ) =>
    navigation.navigate('LocationSearchStack', {
      screen: 'LocationSearchByTextScreen',
      params: {
        label:
          callerRouteParam === 'fromLocation'
            ? t(TripSearchTexts.location.departurePicker.label)
            : t(TripSearchTexts.location.destinationPicker.label),
        callerRouteName: TripSearchRouteNameStatic,
        callerRouteParam,
        initialLocation,
        includeJourneyHistory: true,
      },
    });

  const setCurrentLocationOrRequest = useCallback(
    async function setCurrentLocationOrRequest() {
      if (currentLocation) {
        setCurrentLocationAsFrom();
      } else {
        const status = await requestGeoPermission();
        if (status === 'granted') {
          setCurrentLocationAsFrom();
        }
      }
    },
    [currentLocation, setCurrentLocationAsFrom, requestGeoPermission],
  );

  const onPressed = useCallback(
    (tripPatterns, startIndex) =>
      navigation.navigate('TripDetails', {
        screen: 'Details',
        params: {
          tripPatterns,
          startIndex,
        },
      }),
    [navigation, from, to],
  );

  function swap() {
    log('swap', {
      newFrom: translateLocation(to),
      newTo: translateLocation(from),
    });
    navigation.setParams({
      fromLocation: to,
      toLocation: from,
    });
  }

  function onSearchTimePress() {
    navigation.navigate('DateTimePicker', {
      callerRouteName: 'TripSearch',
      callerRouteParam: 'searchTime',
      searchTime,
    });
  }

  const refresh = () => {
    navigation.setParams({
      fromLocation: from?.resultType === 'geolocation' ? currentLocation : from,
      toLocation: to?.resultType === 'geolocation' ? currentLocation : to,
      searchTime:
        searchTime.option === 'now'
          ? {
              option: 'now',
              date: new Date().toISOString(),
            }
          : searchTime,
    });
  };

  useEffect(refresh, [from, to]);

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(TripSearchTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={{
          type: 'back',
          onPress: () => {
            if (callerRoute?.name) {
              navigation.setParams({
                callerRoute: undefined,
              });

              return navigation.navigate({
                name: callerRoute?.name as any,
                params: {},
              });
            }

            navigation.goBack();
          },
        }}
      />

      <View style={style.searchHeader}>
        <View style={style.paddedContainer}>
          <Section>
            <LocationInputSectionItem
              accessibilityLabel={
                t(TripSearchTexts.location.departurePicker.a11yLabel) +
                screenReaderPause
              }
              accessibilityHint={
                t(TripSearchTexts.location.departurePicker.a11yHint) +
                screenReaderPause
              }
              updatingLocation={updatingLocation && !to}
              location={from}
              label={t(TripSearchTexts.location.departurePicker.label)}
              onPress={() => openLocationSearch('fromLocation', from)}
              icon={<ThemeIcon svg={LocationIcon} />}
              onIconPress={setCurrentLocationOrRequest}
              iconAccessibility={{
                accessible: true,
                accessibilityLabel:
                  from?.resultType == 'geolocation'
                    ? t(
                        TripSearchTexts.location.locationButton.a11yLabel
                          .update,
                      )
                    : t(TripSearchTexts.location.locationButton.a11yLabel.use),
                accessibilityRole: 'button',
              }}
              testID="searchFromButton"
            />

            <LocationInputSectionItem
              accessibilityLabel={t(
                TripSearchTexts.location.destinationPicker.a11yLabel,
              )}
              label={t(TripSearchTexts.location.destinationPicker.label)}
              location={to}
              onPress={() => openLocationSearch('toLocation', to)}
              icon={<ThemeIcon svg={Swap} />}
              onIconPress={swap}
              iconAccessibility={{
                accessible: true,
                accessibilityLabel:
                  t(TripSearchTexts.location.swapButton.a11yLabel) +
                  screenReaderPause,
                accessibilityRole: 'button',
              }}
              testID="searchToButton"
            />
          </Section>
        </View>
        <View style={style.searchParametersButtons}>
          <Button
            text={getSearchTimeLabel(searchTime, timeOfLastSearch, t, language)}
            accessibilityHint={t(TripSearchTexts.dateInput.a11yHint)}
            interactiveColor="interactive_0"
            mode="secondary"
            compact={true}
            onPress={onSearchTimePress}
            testID="dashboardDateTimePicker"
            rightIcon={{svg: Time}}
            viewContainerStyle={style.searchTimeButton}
          />
          {travelSearchFiltersEnabled && (
            <Button
              text={t(TripSearchTexts.filterButton.text)}
              accessibilityHint={t(TripSearchTexts.filterButton.a11yHint)}
              interactiveColor="interactive_1"
              mode="secondary"
              type="inline"
              compact={true}
              onPress={() => {}}
              testID="dashboardDateTimePicker"
              rightIcon={{svg: Filter}}
              viewContainerStyle={style.filterButton}
            />
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={style.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={searchState === 'searching' && !tripPatterns.length}
            onRefresh={refresh}
            tintColor={theme.text.colors.secondary}
          />
        }
      >
        <ScreenReaderAnnouncement message={searchStateMessage} />
        {(!from || !to) && (
          <ThemeText
            color="secondary"
            style={style.missingLocationText}
            testID="missingLocation"
          >
            {t(TripSearchTexts.searchState.noResultReason.MissingLocation)}
          </ThemeText>
        )}
        {from && to && (
          <Results
            tripPatterns={tripPatterns}
            isSearching={isSearching}
            showEmptyScreen={showEmptyScreen}
            isEmptyResult={isEmptyResult}
            resultReasons={noResultReasons}
            onDetailsPressed={onPressed}
            errorType={error}
            searchTime={searchTime}
          />
        )}
        {!tripPatterns.length && <View style={style.emptyResultsSpacer}></View>}
        {!error && isValidLocations && (
          <TouchableOpacity
            onPress={loadMore}
            disabled={searchState === 'searching'}
            style={style.loadMoreButton}
            testID="loadMoreButton"
          >
            {searchState === 'searching' ? (
              <View style={style.loadingIndicator}>
                {tripPatterns.length ? (
                  <>
                    <ActivityIndicator
                      color={theme.text.colors.secondary}
                      style={{
                        marginRight: theme.spacings.medium,
                      }}
                    />
                    <ThemeText color="secondary" testID="searchingForResults">
                      {t(TripSearchTexts.results.fetchingMore)}
                    </ThemeText>
                  </>
                ) : (
                  <ThemeText
                    color="secondary"
                    style={style.loadingText}
                    testID="searchingForResults"
                  >
                    {t(TripSearchTexts.searchState.searching)}
                  </ThemeText>
                )}
              </View>
            ) : (
              <>
                {loadMore ? (
                  <>
                    <ThemeIcon
                      colorType="secondary"
                      svg={ExpandMore}
                      size={'normal'}
                    />
                    <ThemeText color="secondary" testID="resultsLoaded">
                      {' '}
                      {t(TripSearchTexts.results.fetchMore)}
                    </ThemeText>
                  </>
                ) : null}
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};
function useLocations(
  currentLocation: GeoLocation | undefined,
): SearchForLocations {
  const {favorites} = useFavorites();

  const memoedCurrentLocation = useMemo<GeoLocation | undefined>(
    () => currentLocation,
    [
      currentLocation?.coordinates.latitude,
      currentLocation?.coordinates.longitude,
    ],
  );

  let searchedFromLocation =
    useLocationSearchValue<RootProps['route']>('fromLocation');
  const searchedToLocation =
    useLocationSearchValue<RootProps['route']>('toLocation');

  if (searchedToLocation && !searchedFromLocation) {
    searchedFromLocation = currentLocation;
  }

  return useUpdatedLocation(
    searchedFromLocation,
    searchedToLocation,
    memoedCurrentLocation,
    favorites,
  );
}

function useUpdatedLocation(
  searchedFromLocation: SelectableLocationType | undefined,
  searchedToLocation: SelectableLocationType | undefined,
  currentLocation: GeoLocation | undefined,
  favorites: UserFavorites,
): SearchForLocations {
  const [from, setFrom] = useState<Location | undefined>();
  const [to, setTo] = useState<Location | undefined>();
  const navigation = useNavigation<RootProps['navigation']>();

  const setLocation = useCallback(
    (direction: 'from' | 'to', searchedLocation?: SelectableLocationType) => {
      const updater = direction === 'from' ? setFrom : setTo;
      if (!searchedLocation) return updater(searchedLocation);

      switch (searchedLocation.resultType) {
        case 'search':
        case 'geolocation':
          return updater(searchedLocation);
        case 'journey': {
          const toSearch = (i: number): Location => ({
            ...searchedLocation.journeyData[i],
            resultType: 'search',
          });

          // Set both states when journey is passed.
          navigation.setParams({
            fromLocation: toSearch(0),
            toLocation: toSearch(1),
          });
          return;
        }
        case 'favorite': {
          const favorite = favorites.find(
            (f) => f.id === searchedLocation.favoriteId,
          );

          if (favorite) {
            return updater(favorite.location);
          }
        }
      }
    },
    [currentLocation, favorites],
  );

  // Override from state on change
  useEffect(() => {
    setLocation('from', searchedFromLocation);
  }, [searchedFromLocation, setLocation]);

  // Override to state on change
  useEffect(() => {
    setLocation('to', searchedToLocation);
  }, [searchedToLocation, setLocation]);

  return {from, to};
}

function log(message: string, metadata?: {[key: string]: string}) {
  Bugsnag.leaveBreadcrumb(message, {component: 'TripSearch', ...metadata});
}

function translateLocation(location: Location | undefined): string {
  if (!location) return 'Undefined location';
  if (location.resultType === 'geolocation') {
    return location.id;
  }
  return `${location.id}--${location.name}--${location.locality}`;
}

function computeNoResultReasons(
  t: TFunc<typeof Language>,
  date?: SearchTime,
  from?: Location,
  to?: Location,
): string[] {
  let reasons = [];

  if (!!from && !!to) {
    if (coordinatesAreEqual(from.coordinates, to.coordinates)) {
      reasons.push(
        t(TripSearchTexts.searchState.noResultReason.IdenticalLocations),
      );
    } else if (
      coordinatesDistanceInMetres(from.coordinates, to.coordinates) <
      LOCATIONS_REALLY_CLOSE_THRESHOLD
    ) {
      reasons.push(
        t(TripSearchTexts.searchState.noResultReason.CloseLocations),
      );
    }
  }

  const isPastDate = date && date?.option !== 'now' && isInThePast(date.date);

  if (isPastDate) {
    const isArrival = date?.option === 'arrival';
    const dateReason = isArrival
      ? t(TripSearchTexts.searchState.noResultReason.PastArrivalTime)
      : t(TripSearchTexts.searchState.noResultReason.PastDepartureTime);
    reasons.push(dateReason);
  }
  return reasons;
}

export const useShouldShowTravelSearchFilterOnboarding = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const isFocused = useIsFocused();
  const enabled = useTravelSearchFiltersEnabled();

  useEffect(() => {
    if (isFocused && enabled) {
      (async function () {
        const hasRead = await storage.get(
          StorageModelKeysEnum.HasReadTravelSearchFilterOnboarding,
        );
        setShouldShow(hasRead ? !JSON.parse(hasRead) : true);
      })();
    } else {
      setShouldShow(false);
    }
  }, [isFocused, enabled]);
  return shouldShow;
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[ResultsBackgroundColor].background,
    flex: 1,
  },
  scrollView: {
    paddingBottom: theme.spacings.medium,
    backgroundColor: theme.static.background[ResultsBackgroundColor].background,
  },
  paddedContainer: {
    marginHorizontal: theme.spacings.medium,
  },
  searchParametersButtons: {
    margin: theme.spacings.medium,
    flexDirection: 'row',
  },
  searchTimeButton: {flex: 1},
  filterButton: {marginLeft: theme.spacings.medium},
  searchHeader: {
    backgroundColor: theme.static.background[headerBackgroundColor].background,
    elevation: 1,
  },
  loadingIndicator: {
    // marginTop: theme.spacings.xLarge,
    flexDirection: 'row',
  },

  loadingText: {
    // marginTop: theme.spacings.xLarge,
  },
  missingLocationText: {
    padding: theme.spacings.xLarge,
    textAlign: 'center',
  },
  loadMoreButton: {
    paddingVertical: theme.spacings.xLarge,
    marginBottom: theme.spacings.xLarge,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyResultsSpacer: {
    marginTop: theme.spacings.xLarge * 3,
  },
}));

export default TripSearch;
