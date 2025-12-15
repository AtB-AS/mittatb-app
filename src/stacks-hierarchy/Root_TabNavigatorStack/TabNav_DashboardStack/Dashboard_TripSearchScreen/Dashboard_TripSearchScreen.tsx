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
  useFavoritesContext,
  UserFavorites,
} from '@atb/modules/favorites';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  SelectableLocationType,
  useLocationSearchValue,
} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Results} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/Results';
import {useTripsQuery} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-trips-query';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
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
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Platform, RefreshControl, View} from 'react-native';
import {DashboardScreenProps} from '../navigation-types';
import {
  type SearchForLocations,
  TripDateOptions,
  type TripSearchTime,
} from '../types';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {useTravelSearchFiltersState} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-travel-search-filters-state';
import {SelectedFiltersButtons} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/SelectedFiltersButtons';
import {FullScreenView} from '@atb/components/screen-view';
import {CityZoneMessage} from './components/CityZoneMessage';
import {TripPattern} from '@atb/api/types/trips';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useNonTransitTripsQuery} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-non-transit-trips-query';
import {NonTransitResults} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/NonTransitResults';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {areDefaultFiltersSelected, getSearchTimeLabel} from './utils';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {isDefined} from '@atb/utils/presence';
import {onlyUniques} from '@atb/utils/only-uniques';
import {DatePickerSheet} from '@atb/components/date-selection';
import SharedTexts from '@atb/translations/shared';
import {TravelSearchFiltersBottomSheet} from './components/TravelSearchFiltersBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type RootProps = DashboardScreenProps<'Dashboard_TripSearchScreen'>;

const getHeaderBackgroundColor = (theme: Theme) =>
  theme.color.background.accent[0];
const getResultsBackgroundColor = (theme: Theme) =>
  theme.color.background.neutral[1];

export const Dashboard_TripSearchScreen: React.FC<RootProps> = ({
  navigation,
  route,
}) => {
  const {callerRoute} = route.params;
  const styles = useStyles();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[1];
  const statusColor = theme.color.status.info.primary;
  const [searchTime, setSearchTime] = useState<TripSearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const focusRef = useFocusOnLoad(navigation);

  const {language, t} = useTranslation();
  const [updatingLocation] = useState<boolean>(false);
  const analytics = useAnalyticsContext();
  const isFocused = useIsFocusedAndActive();
  const filterButtonWrapperRef = useRef(null);
  const filterButtonRef = useRef(null);
  const travelSearchBottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const timePickerBottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const timePickerCloseRef = useRef<View | null>(null);

  const {location, requestLocationPermission} = useGeolocationContext();

  const currentLocation = location || undefined;

  const {from, to} = useLocations(currentLocation);

  const filtersState = useTravelSearchFiltersState();

  const {isFlexibleTransportEnabled: isFlexibleTransportEnabledInRemoteConfig} =
    useFeatureTogglesContext();
  const {tripPatterns, timeOfLastSearch, loadMore, searchState, error} =
    useTripsQuery(from, to, searchTime, filtersState.filtersSelection);
  const {nonTransitTrips} = useNonTransitTripsQuery(
    from,
    to,
    searchTime,
    filtersState.filtersSelection,
  );

  const isSearching = searchState === 'searching';
  const showEmptyScreen = !tripPatterns && !isSearching && !error;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const noResultReasons = computeNoResultReasons(t, searchTime, from, to);
  const isValidLocations = isValidTripLocations(from, to);
  const [flexibleTransportInfoDismissed, setFlexibleTransportInfoDismissed] =
    useState(false);
  const isFlexibleTransportEnabled = isFlexibleTransportEnabledInRemoteConfig;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, t]);

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
          ? t(SharedTexts.from)
          : t(SharedTexts.to),
      callerRouteName: route.name,
      callerRouteParam,
      initialLocation,
      includeJourneyHistory: true,
      onlyStopPlacesCheckboxInitialState: false,
    });

  const setCurrentLocationOrRequest = useCallback(
    async function setCurrentLocationOrRequest() {
      if (currentLocation) {
        setCurrentLocationAsFrom();
      } else {
        const status = await requestLocationPermission(false);
        if (status === 'granted') {
          setCurrentLocationAsFrom();
        }
      }
    },
    [currentLocation, setCurrentLocationAsFrom, requestLocationPermission],
  );

  const onPressed = useCallback(
    (
      tripPattern: TripPattern,
      opts?: {
        analyticsMetadata?: {[key: string]: any};
      },
    ) => {
      analytics.logEvent(
        'Trip search',
        'Trip details opened',
        opts?.analyticsMetadata,
      );
      navigation.navigate('Dashboard_TripDetailsScreen', {
        tripPattern,
      });
    },
    [analytics, navigation],
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

  const onSearchTimePress = () => {
    timePickerBottomSheetModalRef.current?.present();
  };

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
          : {...searchTime},
    });
  };

  const nonTransitTripsVisible =
    (tripPatterns.length > 0 || searchState === 'search-empty-result') &&
    nonTransitTrips.length > 0;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refresh, [from, to]);

  return (
    <View style={styles.container}>
      <FullScreenView
        focusRef={focusRef}
        titleAlwaysVisible={true}
        headerProps={{
          title: t(TripSearchTexts.header.title),
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
          // Quick fix for iOS to fix stuck spinner by removing the RefreshControl when not focused
          isFocused || Platform.OS === 'android' ? (
            <RefreshControl
              refreshing={
                Platform.OS === 'ios'
                  ? false
                  : searchState === 'searching' && !tripPatterns.length
              }
              onRefresh={refresh}
            />
          ) : undefined
        }
        parallaxContent={() => (
          <View style={styles.searchHeader}>
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
                label={t(SharedTexts.from)}
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
                label={t(SharedTexts.to)}
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
            <View style={styles.searchParametersButtons}>
              <Button
                expanded={true}
                text={getSearchTimeLabel(
                  searchTime,
                  timeOfLastSearch,
                  t,
                  language,
                )}
                accessibilityHint={t(TripSearchTexts.dateInput.a11yHint)}
                mode="primary"
                interactiveColor={interactiveColor}
                type="small"
                style={styles.searchTimeButton}
                ref={timePickerCloseRef}
                onPress={onSearchTimePress}
                testID="dashboardDateTimePicker"
                rightIcon={{
                  svg: Time,
                  notificationColor:
                    searchTime.option !== 'now' ? statusColor : undefined,
                }}
              />
              {filtersState.enabled && (
                <View ref={filterButtonWrapperRef} collapsable={false}>
                  <Button
                    expanded={false}
                    text={t(TripSearchTexts.filterButton.text)}
                    accessibilityHint={t(TripSearchTexts.filterButton.a11yHint)}
                    mode="primary"
                    interactiveColor={interactiveColor}
                    type="small"
                    onPress={() =>
                      travelSearchBottomSheetModalRef.current?.present()
                    }
                    testID="filterButton"
                    ref={filterButtonRef}
                    rightIcon={{
                      svg: Filter,
                      notificationColor: !areDefaultFiltersSelected(
                        filtersState.filtersSelection?.transportModes,
                      )
                        ? statusColor
                        : undefined,
                    }}
                  />
                </View>
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
              style={styles.missingLocationText}
              testID="missingLocation"
            >
              {t(TripSearchTexts.searchState.noResultReason.MissingLocation)}
            </ThemeText>
          )}
          <View style={styles.globalMessage}>
            <GlobalMessage
              textColor={theme.color.background.neutral[0]}
              globalMessageContext={GlobalMessageContextEnum.appTripResults}
              ruleVariables={{
                transportModes: tripPatterns
                  .flatMap((tp) => tp.legs)
                  .map((leg) => leg.mode)
                  .filter(isDefined)
                  .filter(onlyUniques),
                transportSubmodes: tripPatterns
                  .flatMap((tp) => tp.legs)
                  .map((leg) => leg.transportSubmode)
                  .filter(isDefined)
                  .filter(onlyUniques),
                authorities: tripPatterns
                  .flatMap((tp) => tp.legs)
                  .map((leg) => leg.authority?.id)
                  .filter(isDefined)
                  .filter(onlyUniques),
                publicCodes: tripPatterns
                  .flatMap((tp) => tp.legs)
                  .map((leg) => leg.line?.publicCode)
                  .filter(isDefined)
                  .filter(onlyUniques),
              }}
            />
          </View>
          {from && to && (
            <View>
              {filtersState.enabled && (
                <SelectedFiltersButtons
                  filtersSelection={filtersState.filtersSelection}
                  resetTransportModes={filtersState.resetTransportModes}
                />
              )}
              {isFlexibleTransportEnabled &&
                !flexibleTransportInfoDismissed &&
                (tripPatterns.length > 0 ||
                  searchState === 'search-empty-result') &&
                !error && (
                  <CityZoneMessage
                    from={from}
                    to={to}
                    onDismiss={() => {
                      setFlexibleTransportInfoDismissed(true);
                      analytics.logEvent(
                        'Flexible transport',
                        'Message box dismissed',
                      );
                    }}
                  />
                )}
              {nonTransitTripsVisible && (
                <NonTransitResults
                  tripPatterns={nonTransitTrips}
                  onDetailsPressed={onPressed}
                />
              )}
              <Results
                tripPatterns={tripPatterns}
                isSearching={isSearching}
                showEmptyScreen={showEmptyScreen}
                isEmptyResult={isEmptyResult}
                resultReasons={noResultReasons}
                onDetailsPressed={(tripPattern, resultIndex) =>
                  onPressed(tripPattern, {analyticsMetadata: {resultIndex}})
                }
                errorType={error}
                searchTime={searchTime}
                anyFiltersApplied={
                  filtersState.enabled && filtersState.anyFiltersApplied
                }
              />
            </View>
          )}
          {!tripPatterns.length && <View style={styles.emptyResultsSpacer} />}
          {!error && isValidLocations && (
            <PressableOpacity
              onPress={loadMore}
              disabled={searchState === 'searching'}
              style={styles.loadMoreButton}
              testID="loadMoreButton"
            >
              {searchState === 'searching' ? (
                <View style={styles.loadingIndicator}>
                  {tripPatterns.length ? (
                    <>
                      <ActivityIndicator
                        color={theme.color.foreground.dynamic.secondary}
                        style={{
                          marginRight: theme.spacing.medium,
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
                        color="secondary"
                        svg={ExpandMore}
                        size="normal"
                      />
                      <ThemeText color="secondary" testID="resultsLoaded">
                        {' '}
                        {t(TripSearchTexts.results.fetchMore)}
                      </ThemeText>
                    </>
                  ) : null}
                </>
              )}
            </PressableOpacity>
          )}
        </View>
      </FullScreenView>
      {filtersState.filtersSelection && (
        <TravelSearchFiltersBottomSheet
          filtersSelection={filtersState.filtersSelection}
          onSave={filtersState.setFiltersSelection}
          bottomSheetModalRef={travelSearchBottomSheetModalRef}
          onCloseFocusRef={filterButtonRef}
        />
      )}
      <DatePickerSheet
        initialDate={searchTime.date}
        onSave={setSearchTime}
        options={TripDateOptions.map((option) => ({
          option,
          text: t(TripSearchTexts.dateInput.options[option]),
          selected: searchTime.option === option,
        }))}
        onCloseFocusRef={timePickerCloseRef}
        bottomSheetModalRef={timePickerBottomSheetModalRef}
      />
    </View>
  );
};

function useLocations(
  currentLocation: GeoLocation | undefined,
): SearchForLocations {
  const route = useRoute<RootProps['route']>();
  const {favorites} = useFavoritesContext();

  const memoedCurrentLocation = useMemo<GeoLocation | undefined>(
    () => currentLocation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentLocation?.coordinates.latitude,
      currentLocation?.coordinates.longitude,
    ],
  );

  let searchedFromLocation = useLocationSearchValue(route, 'fromLocation');
  const searchedToLocation = useLocationSearchValue(route, 'toLocation');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  date?: TripSearchTime,
  from?: Location,
  to?: Location,
): string[] {
  const reasons = [];

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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getResultsBackgroundColor(theme).background,
    flex: 1,
  },
  scrollView: {
    paddingBottom: theme.spacing.medium,
    backgroundColor: getResultsBackgroundColor(theme).background,
  },
  searchParametersButtons: {
    marginTop: theme.spacing.medium,
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  searchTimeButton: {flexGrow: 1},
  searchHeader: {
    marginHorizontal: theme.spacing.medium,
    backgroundColor: getHeaderBackgroundColor(theme).background,
  },
  loadingIndicator: {
    flexDirection: 'row',
  },
  missingLocationText: {
    padding: theme.spacing.xLarge,
    textAlign: 'center',
  },
  loadMoreButton: {
    paddingVertical: theme.spacing.xLarge,
    marginBottom: theme.spacing.xLarge,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyResultsSpacer: {
    marginTop: theme.spacing.xLarge * 3,
  },
  globalMessage: {
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
  },
}));
