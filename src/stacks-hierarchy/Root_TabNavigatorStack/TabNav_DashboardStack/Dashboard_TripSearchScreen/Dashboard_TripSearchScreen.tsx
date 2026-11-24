import {Filter, Swap} from '@atb/assets/svg/mono-icons/actions';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {LocationInputSectionItem, Section} from '@atb/components/sections';
import {
  GeoLocation,
  Location,
  useFavoritesContext,
  UserFavorites,
} from '@atb/modules/favorites';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  SelectableLocationType,
  usePendingLocationSearchStore,
} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Results} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/Results';

import {TripsProps, useTrips} from './use-trips';
import {StyleSheet, Theme} from '@atb/theme';
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
import {View} from 'react-native';
import {DashboardScreenProps} from '../navigation-types';
import {
  type SearchForLocations,
  TripDateOptions,
  type TripSearchTime,
} from '../types';
import {EditActionSectionItem} from '@atb/components/sections';
import {useTravelSearchFiltersState} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-travel-search-filters-state';

import {FullScreenView} from '@atb/components/screen-view';
import {CityZoneMessage} from './components/CityZoneMessage';
import {TripSearchStateAnnouncement} from './components/TripSearchStateAnnouncement';
import {LoadMoreButton} from './components/LoadMoreButton';
import {TripPattern} from '@atb/api/types/trips';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {NonTransitResults} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/NonTransitResults';
import {
  getSearchTime,
  getSearchTimeLabel,
  sanitizeSearchTime,
  uniqueLegValues,
} from './utils';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {GlobalMessage} from '@atb/modules/global-messages';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {DatePickerSheet} from '@atb/components/date-selection';
import SharedTexts from '@atb/translations/shared';
import {TravelSearchFiltersBottomSheet} from './components/TravelSearchFiltersBottomSheet';
import {BottomSheetModalMethods} from '@atb/components/bottom-sheet';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {WithOverlayButton} from '@atb/components/overlay-button';
import {useManualRefreshControlProps} from '@atb/utils/use-manual-refresh-props';
import type {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';

const RESULT_KEY_FROM = 'Dashboard_TripSearchScreen--fromLocation';
const RESULT_KEY_TO = 'Dashboard_TripSearchScreen--toLocation';

type RootProps = DashboardScreenProps<'Dashboard_TripSearchScreen'>;

const getHeaderBackgroundColor = (theme: Theme) =>
  theme.color.background.neutral[1];
const getResultsBackgroundColor = (theme: Theme) =>
  theme.color.background.neutral[1];

export const Dashboard_TripSearchScreen: React.FC<RootProps> = ({
  navigation,
  route,
}) => {
  const {callerRoute} = route.params;
  const styles = useStyles();
  const [searchTime, setSearchTime] = useState<TripSearchTime>(
    () =>
      route.params.searchTime ?? {
        option: 'now',
        date: new Date().toISOString(),
      },
  );
  const focusRef = useFocusOnLoad(navigation);

  const {language, t} = useTranslation();
  const analytics = useAnalyticsContext();
  const filterButtonWrapperRef = useRef(null);
  const filterButtonRef = useRef(null);
  const travelSearchBottomSheetModalRef =
    useRef<BottomSheetModalMethods | null>(null);
  const timePickerBottomSheetModalRef = useRef<BottomSheetModalMethods | null>(
    null,
  );
  const timePickerCloseRef = useRef<View | null>(null);

  const {
    isFlexibleTransportEnabled: isFlexibleTransportEnabledInRemoteConfig,
    isShowCancelledDeparturesEnabled,
  } = useFeatureTogglesContext();

  const {location} = useGeolocationContext();

  const currentLocation = location || undefined;

  const {pendingResult, clearPendingResult} = usePendingLocationSearchStore();

  const {from, to} = useLocations(currentLocation);

  const fromLocationParam = route.params?.fromLocation;
  const toLocationParam = route.params?.toLocation;
  const getRefreshedGeolocationParams = useCallback(() => {
    if (!currentLocation) return {};
    return {
      ...(fromLocationParam?.resultType === 'geolocation' && {
        fromLocation: currentLocation,
      }),
      ...(toLocationParam?.resultType === 'geolocation' && {
        toLocation: currentLocation,
      }),
    };
  }, [fromLocationParam, toLocationParam, currentLocation]);

  useEffect(() => {
    if (pendingResult?.key === RESULT_KEY_FROM) {
      navigation.setParams({
        ...getRefreshedGeolocationParams(),
        fromLocation: pendingResult.location,
      });
      clearPendingResult();
    } else if (pendingResult?.key === RESULT_KEY_TO) {
      navigation.setParams({
        ...getRefreshedGeolocationParams(),
        toLocation: pendingResult.location,
      });
      clearPendingResult();
    }
  }, [
    pendingResult,
    clearPendingResult,
    navigation,
    getRefreshedGeolocationParams,
  ]);
  const tripSearchEnabled = isValidTripLocations(from, to);
  const hasLocations = !!from && !!to;

  const filtersState = useTravelSearchFiltersState(route.params.initialFilters);

  const arriveBy = searchTime.option === 'arrival';
  const sanitizedSearchTime = useMemo(
    () => sanitizeSearchTime(searchTime),
    [searchTime],
  );

  const tripsProps: TripsProps = useMemo(
    () => ({
      fromLocation: from,
      toLocation: to,
      searchTime: sanitizedSearchTime,
      arriveBy,
      travelSearchFiltersSelection: filtersState.filtersSelection,
      includeCancellations: isShowCancelledDeparturesEnabled,
    }),
    [
      from,
      to,
      sanitizedSearchTime,
      arriveBy,
      filtersState.filtersSelection,
      isShowCancelledDeparturesEnabled,
    ],
  );

  const {
    tripPatterns,
    timeOfLastSearch,
    loadMoreTrips,
    refetchTrips,
    tripsSearchState,
    tripsIsError,
    tripsIsNetworkError,
  } = useTrips(tripsProps, tripSearchEnabled);

  const isSearching = tripsSearchState === 'searching';
  const showEmptyScreen = !tripPatterns && !isSearching && !tripsIsError;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const noResultReasons = computeNoResultReasons(t, searchTime, from, to);
  const [flexibleTransportInfoDismissed, setFlexibleTransportInfoDismissed] =
    useState(false);
  const isFlexibleTransportEnabled = isFlexibleTransportEnabledInRemoteConfig;
  const shouldShowCityZoneMessage =
    isFlexibleTransportEnabled &&
    !flexibleTransportInfoDismissed &&
    (tripPatterns.length > 0 || tripsSearchState === 'search-empty-result') &&
    !tripsIsError;

  const screenHasFocus = useIsFocused();

  const openLocationSearch = (
    resultKey: typeof RESULT_KEY_FROM | typeof RESULT_KEY_TO,
    initialLocation: Location | undefined,
  ) => {
    clearPendingResult();
    navigation.navigate('Root_LocationSearchByTextScreen', {
      resultKey,
      label:
        resultKey === RESULT_KEY_FROM ? t(SharedTexts.from) : t(SharedTexts.to),
      initialLocation,
      includeJourneyHistory: true,
      onlyStopPlacesCheckboxInitialState: false,
    });
  };

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

  // Stable so Results can reuse its rendered rows when the screen re-renders.
  const onResultDetailsPressed = useCallback(
    (tripPattern: TripPattern, resultIndex?: number) =>
      onPressed(tripPattern, {analyticsMetadata: {resultIndex}}),
    [onPressed],
  );

  function swap() {
    const {fromLocation: refreshedFrom = from, toLocation: refreshedTo = to} =
      getRefreshedGeolocationParams();
    log('swap', {
      newFrom: translateLocation(refreshedTo),
      newTo: translateLocation(refreshedFrom),
    });
    analytics.logEvent('Trip search', 'Locations to/from swapped');
    navigation.setParams({
      fromLocation: refreshedTo,
      toLocation: refreshedFrom,
    });
  }

  const onSearchTimePress = () => {
    timePickerBottomSheetModalRef.current?.present();
  };

  const refreshGeolocationParams = () => {
    const refreshedGeolocationParams = getRefreshedGeolocationParams();
    if (Object.keys(refreshedGeolocationParams).length) {
      navigation.setParams(refreshedGeolocationParams);
    }
  };

  const onSearchTimeSave = (newSearchTime: TripSearchTime) => {
    setSearchTime(newSearchTime);
    refreshGeolocationParams();
  };

  const onFiltersSave = (
    newFiltersSelection: TravelSearchFiltersSelectionType,
  ) => {
    filtersState.setFiltersSelection(newFiltersSelection);
    refreshGeolocationParams();
  };

  const forceRefresh = useCallback(() => {
    const updatedSearchTime: TripSearchTime =
      searchTime.option === 'now'
        ? {
            option: 'now',
            date: new Date().toISOString(),
          }
        : {...searchTime};
    setSearchTime(updatedSearchTime);
    navigation.setParams({
      ...(from?.resultType === 'geolocation' && {
        fromLocation: currentLocation,
      }),
      ...(to?.resultType === 'geolocation' && {
        toLocation: currentLocation,
      }),
      searchTime: updatedSearchTime,
    });
    refetchTrips();
  }, [from, to, currentLocation, searchTime, navigation, refetchTrips]);

  const refreshControlProps = useManualRefreshControlProps({
    refreshing: tripsSearchState === 'searching' && !tripPatterns.length,
    onRefresh: forceRefresh,
  });

  return (
    <View style={styles.container}>
      <TripSearchStateAnnouncement
        tripsSearchState={tripsSearchState}
        screenHasFocus={screenHasFocus}
      />
      <FullScreenView
        focusRef={focusRef}
        titleAlwaysVisible={true}
        headerProps={{
          title: t(TripSearchTexts.header.title),
          leftButton: {
            type: 'back',
            onPress: () => {
              if (callerRoute) {
                navigation.setParams({
                  callerRoute: undefined,
                });

                return navigation.navigate(...callerRoute);
              }

              navigation.goBack();
            },
          },
        }}
        refreshControlProps={refreshControlProps}
        headerContent={() => (
          <View style={styles.searchHeader}>
            <WithOverlayButton
              svgIcon={Swap}
              onPress={swap}
              overlayPosition="right"
              accessibilityLabel={
                t(TripSearchTexts.location.swapButton.a11yLabel) +
                screenReaderPause
              }
            >
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
                  location={from}
                  label={t(SharedTexts.from)}
                  onPress={() => openLocationSearch(RESULT_KEY_FROM, from)}
                  testID="searchFromButton"
                />

                <LocationInputSectionItem
                  accessibilityLabel={t(
                    TripSearchTexts.location.destinationPicker.a11yLabel,
                  )}
                  label={t(SharedTexts.to)}
                  location={to}
                  onPress={() => openLocationSearch(RESULT_KEY_TO, to)}
                  testID="searchToButton"
                />
              </Section>
            </WithOverlayButton>
            <View style={styles.searchParametersButtons}>
              <Section style={styles.searchTimeSection}>
                <EditActionSectionItem
                  ref={timePickerCloseRef}
                  text={t(TripSearchTexts.dateInput.options[searchTime.option])}
                  subText={getSearchTime(
                    searchTime,
                    timeOfLastSearch,
                    language,
                  )}
                  accessibilityLabel={getSearchTimeLabel(
                    searchTime,
                    timeOfLastSearch,
                    t,
                    language,
                  )}
                  accessibilityHint={t(TripSearchTexts.dateInput.a11yHint)}
                  onPress={onSearchTimePress}
                  testID="dashboardDateTimePicker"
                />
              </Section>
              {filtersState.enabled && (
                <View
                  ref={filterButtonWrapperRef}
                  collapsable={false}
                  style={styles.filterSection}
                >
                  <Section>
                    <EditActionSectionItem
                      ref={filterButtonRef}
                      rightIcon={Filter}
                      text={t(TripSearchTexts.filterButton.text)}
                      subText={getFiltersSubText(filtersState.filtersSelection)}
                      accessibilityHint={t(
                        TripSearchTexts.filterButton.a11yHint,
                      )}
                      onPress={() =>
                        travelSearchBottomSheetModalRef.current?.present()
                      }
                      testID="filterButton"
                    />
                  </Section>
                </View>
              )}
            </View>
          </View>
        )}
      >
        <View style={styles.contentContainer}>
          {!hasLocations && (
            <ThemeText
              type="secondary"
              style={styles.missingLocationText}
              testID="missingLocation"
            >
              {t(TripSearchTexts.searchState.noResultReason.MissingLocation)}
            </ThemeText>
          )}
          <GlobalMessage
            style={styles.globalMessage}
            globalMessageContext={GlobalMessageContextEnum.appTripResults}
            ruleVariables={{
              transportModes: uniqueLegValues(tripPatterns, (leg) => leg.mode),
              transportSubmodes: uniqueLegValues(
                tripPatterns,
                (leg) => leg.transportSubmode,
              ),
              authorities: uniqueLegValues(
                tripPatterns,
                (leg) => leg.authority?.id,
              ),
              publicCodes: uniqueLegValues(
                tripPatterns,
                (leg) => leg.line?.publicCode,
              ),
            }}
          />
          {shouldShowCityZoneMessage && (
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
          {tripSearchEnabled && (
            <NonTransitResults
              tripsProps={tripsProps}
              onDetailsPressed={onPressed}
            />
          )}
          {hasLocations && (
            <Results
              tripPatterns={tripPatterns}
              isSearching={isSearching}
              showEmptyScreen={showEmptyScreen}
              isEmptyResult={isEmptyResult}
              resultReasons={noResultReasons}
              onDetailsPressed={onResultDetailsPressed}
              tripsIsError={tripsIsError}
              tripsIsNetworkError={tripsIsNetworkError}
            />
          )}
          {!tripPatterns.length && <View style={styles.emptyResultsSpacer} />}
          <LoadMoreButton
            loadMoreTrips={loadMoreTrips}
            isSearching={isSearching}
            tripsIsError={tripsIsError}
            tripSearchEnabled={tripSearchEnabled}
          />
        </View>
      </FullScreenView>
      {filtersState.filtersSelection && (
        <TravelSearchFiltersBottomSheet
          filtersSelection={filtersState.filtersSelection}
          onSave={onFiltersSave}
          bottomSheetModalRef={travelSearchBottomSheetModalRef}
          onCloseFocusRef={filterButtonRef}
        />
      )}
      <DatePickerSheet
        initialDate={searchTime.date}
        initialOption={searchTime.option}
        onSave={onSearchTimeSave}
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
      currentLocation?.name,
    ],
  );

  let searchedFromLocation = route.params?.fromLocation;
  const searchedToLocation = route.params?.toLocation;

  if (searchedToLocation && !searchedFromLocation) {
    searchedFromLocation = memoedCurrentLocation;
  }

  return useUpdatedLocation(
    searchedFromLocation,
    searchedToLocation,
    favorites,
  );
}

function useUpdatedLocation(
  searchedFromLocation: SelectableLocationType | undefined,
  searchedToLocation: SelectableLocationType | undefined,
  favorites: UserFavorites,
): SearchForLocations {
  const navigation = useNavigation<RootProps['navigation']>();

  const journey =
    searchedFromLocation?.resultType === 'journey'
      ? searchedFromLocation
      : searchedToLocation?.resultType === 'journey'
        ? searchedToLocation
        : undefined;

  const from = useMemo(
    () =>
      journey
        ? journeyToSearchLocation(journey, 0)
        : resolveLocation(searchedFromLocation, favorites),
    [journey, searchedFromLocation, favorites],
  );
  const to = useMemo(
    () =>
      journey
        ? journeyToSearchLocation(journey, 1)
        : resolveLocation(searchedToLocation, favorites),
    [journey, searchedToLocation, favorites],
  );

  // Replace a journey param with explicit from/to params. Passing the same
  // memoized objects keeps from/to stable, so no extra search runs.
  useEffect(() => {
    if (journey) {
      navigation.setParams({fromLocation: from, toLocation: to});
    }
  }, [journey, from, to, navigation]);

  return useMemo(() => ({from, to}), [from, to]);
}

function resolveLocation(
  location: SelectableLocationType | undefined,
  favorites: UserFavorites,
): Location | undefined {
  switch (location?.resultType) {
    case 'search':
    case 'geolocation':
      return location;
    case 'favorite':
      return favorites.find((f) => f.id === location.favoriteId)?.location;
    default:
      return undefined;
  }
}

function journeyToSearchLocation(
  journey: Extract<SelectableLocationType, {resultType: 'journey'}>,
  index: 0 | 1,
): Location {
  return {...journey.journeyData[index], resultType: 'search'};
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

const getFiltersSubText = (
  filtersSelection?: TravelSearchFiltersSelectionType,
) => {
  const transportModes = filtersSelection?.transportModes;
  if (!transportModes) return undefined;

  const count = transportModes.filter((tm) => tm.selected).length;
  return `${count}`;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getResultsBackgroundColor(theme).background,
    flex: 1,
  },
  searchParametersButtons: {
    marginTop: theme.spacing.small,
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  searchTimeSection: {flex: 2},
  filterSection: {flex: 1},
  searchHeader: {
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.medium,
    backgroundColor: getHeaderBackgroundColor(theme).background,
  },
  missingLocationText: {
    padding: theme.spacing.xLarge,
    textAlign: 'center',
  },
  emptyResultsSpacer: {
    marginTop: theme.spacing.xLarge * 3,
  },
  contentContainer: {
    gap: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
  globalMessage: {
    marginHorizontal: theme.spacing.medium,
  },
}));
