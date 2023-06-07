import {Filter, Swap} from '@atb/assets/svg/mono-icons/actions';
import {ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {LocationInputSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  GeoLocation,
  Location,
  useFavorites,
  UserFavorites,
} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {
  SelectableLocationType,
  useLocationSearchValue,
} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {
  getSearchTimeLabel,
  SearchTime,
  useSearchTimeValue,
} from '@atb/journey-date-picker';
import {Results} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/Results';
import {useTripsQuery} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-trips-query';
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
  TouchableOpacity,
  View,
} from 'react-native';
import {DashboardScreenProps} from '../navigation-types';
import {SearchForLocations} from '../types';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {storage, StorageModelKeysEnum} from '@atb/storage';
import {useTravelSearchFiltersState} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-travel-search-filters-state';
import {SelectedFiltersButtons} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/SelectedFiltersButtons';
import {FullScreenView} from '@atb/components/screen-view';
import {CityZoneMessage} from './components/CityZoneMessage';
import {useFlexibleTransportEnabled} from './use-flexible-transport-enabled';
import {TripPattern} from '@atb/api/types/trips';
import {useAnalytics} from '@atb/analytics';

type RootProps = DashboardScreenProps<'Dashboard_TripSearchScreen'>;

const headerBackgroundColor: StaticColorByType<'background'> =
  'background_accent_0';

const ResultsBackgroundColor: StaticColorByType<'background'> = 'background_1';

export const Dashboard_TripSearchScreen: React.FC<RootProps> = ({
  navigation,
  route,
}) => {
  const {callerRoute} = route.params;
  const style = useStyle();
  const {theme} = useTheme();
  const {language, t} = useTranslation();
  const [updatingLocation] = useState<boolean>(false);
  const analytics = useAnalytics();

  const shouldShowTravelSearchFilterOnboarding =
    useShouldShowTravelSearchFilterOnboarding();
  useEffect(() => {
    if (shouldShowTravelSearchFilterOnboarding) {
      analytics.logEvent('Trip search', 'Filter onboarding shown');
      navigation.navigate('Dashboard_TravelSearchFilterOnboardingScreen');
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

  const filtersState = useTravelSearchFiltersState();
  const isFlexibleTransportEnabledInRemoteConfig =
    useFlexibleTransportEnabled();
  const {tripPatterns, timeOfLastSearch, loadMore, searchState, error} =
    useTripsQuery(from, to, searchTime, filtersState?.filtersSelection);

  const isSearching = searchState === 'searching';
  const showEmptyScreen = !tripPatterns && !isSearching && !error;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const noResultReasons = computeNoResultReasons(t, searchTime, from, to);
  const isValidLocations = isValidTripLocations(from, to);
  const isFlexibleTransportEnabled =
    isFlexibleTransportEnabledInRemoteConfig &&
    filtersState?.filtersSelection?.flexibleTransport?.enabled;

  const [searchStateMessage, setSearchStateMessage] = useState<
    string | undefined
  >();

  const screenHasFocus = useIsFocused();

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
    navigation.navigate('Root_LocationSearchByTextScreen', {
      label:
        callerRouteParam === 'fromLocation'
          ? t(TripSearchTexts.location.departurePicker.label)
          : t(TripSearchTexts.location.destinationPicker.label),
      callerRouteName: route.name,
      callerRouteParam,
      initialLocation,
      includeJourneyHistory: true,
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
    (tripPattern: TripPattern, resultIndex) => {
      analytics.logEvent('Trip search', 'Trip details opened', {
        resultIndex,
      });
      navigation.navigate('Dashboard_TripDetailsScreen', {
        tripPattern,
      });
    },
    [navigation, from, to],
  );

  function swap() {
    log('swap', {
      newFrom: translateLocation(to),
      newTo: translateLocation(from),
    });
    analytics.logEvent('Trip search', 'Locations to/from swapped');
    navigation.setParams({
      fromLocation: to,
      toLocation: from,
    });
  }

  function onSearchTimePress() {
    navigation.navigate('Dashboard_JourneyDatePickerScreen', {
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
      <FullScreenView
        headerProps={{
          title: t(TripSearchTexts.header.title),
          rightButton: {type: 'chat'},
          leftButton: {
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
          },
        }}
        refreshControl={
          <RefreshControl
            refreshing={searchState === 'searching' && !tripPatterns.length}
            onRefresh={refresh}
          />
        }
        parallaxContent={() => (
          <View style={style.searchHeader}>
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
                      : t(
                          TripSearchTexts.location.locationButton.a11yLabel.use,
                        ),
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
            <View style={style.searchParametersButtons}>
              <Button
                text={getSearchTimeLabel(
                  searchTime,
                  timeOfLastSearch,
                  t,
                  language,
                )}
                accessibilityHint={t(TripSearchTexts.dateInput.a11yHint)}
                accessibilityLabel={getSearchTimeLabel(
                  searchTime,
                  timeOfLastSearch,
                  t,
                  language,
                )}
                interactiveColor="interactive_0"
                mode="secondary"
                compact={true}
                onPress={onSearchTimePress}
                testID="dashboardDateTimePicker"
                rightIcon={{
                  svg: Time,
                  notification:
                    searchTime.option !== 'now'
                      ? {color: 'valid', backgroundColor: 'background_accent_0'}
                      : undefined,
                }}
                viewContainerStyle={style.searchTimeButton}
              />
              {filtersState.enabled && (
                <Button
                  text={t(TripSearchTexts.filterButton.text)}
                  accessibilityHint={t(TripSearchTexts.filterButton.a11yHint)}
                  interactiveColor="interactive_0"
                  mode="secondary"
                  type="inline"
                  compact={true}
                  onPress={filtersState.openBottomSheet}
                  testID="dashboardDateTimePicker"
                  rightIcon={{
                    svg: Filter,
                    notification: filtersState.anyFiltersApplied
                      ? {color: 'valid', backgroundColor: 'background_accent_0'}
                      : undefined,
                  }}
                  viewContainerStyle={style.filterButton}
                  ref={filtersState.closeRef}
                />
              )}
            </View>
          </View>
        )}
      >
        <View>
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
            <View>
              {filtersState.enabled && (
                <SelectedFiltersButtons
                  filtersSelection={filtersState.filtersSelection}
                  resetTransportModes={filtersState.resetTransportModes}
                />
              )}
              {isFlexibleTransportEnabled &&
                tripPatterns.length > 0 &&
                !error && (
                  <CityZoneMessage
                    from={from}
                    to={to}
                    onDismiss={() => {
                      filtersState.enabled &&
                        filtersState.disableFlexibleTransport();
                      analytics.logEvent(
                        'Flexible transport',
                        'Message box dismissed',
                      );
                    }}
                  />
                )}
              <Results
                tripPatterns={tripPatterns}
                isSearching={isSearching}
                showEmptyScreen={showEmptyScreen}
                isEmptyResult={isEmptyResult}
                resultReasons={noResultReasons}
                onDetailsPressed={onPressed}
                errorType={error}
                searchTime={searchTime}
                anyFiltersApplied={
                  filtersState.enabled && filtersState.anyFiltersApplied
                }
              />
            </View>
          )}
          {!tripPatterns.length && (
            <View style={style.emptyResultsSpacer}></View>
          )}
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
                    <ThemeText color="secondary" testID="searchingForResults">
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
        </View>
      </FullScreenView>
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
  const {enabled} = useTravelSearchFiltersState();

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
  searchParametersButtons: {
    marginTop: theme.spacings.medium,
    flexDirection: 'row',
  },
  searchTimeButton: {flex: 1},
  filterButton: {marginLeft: theme.spacings.medium},
  searchHeader: {
    marginHorizontal: theme.spacings.medium,
    backgroundColor: theme.static.background[headerBackgroundColor].background,
  },
  loadingIndicator: {
    flexDirection: 'row',
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
