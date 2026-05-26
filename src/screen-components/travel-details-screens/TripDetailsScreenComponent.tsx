import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {Leg, Place, TripPattern} from '@atb/api/types/trips';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {hasLegsWeCantSellTicketsFor} from '@atb/modules/operator-config';
import {
  FareProductTypeConfig,
  FareZone,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
// eslint-disable-next-line no-restricted-imports
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {FareZoneWithMetadata} from '@atb/modules/fare-zones-selector';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {TravelDetailsMapScreenParams} from '@atb/screen-components/travel-details-map-screen';
import {ServiceJourneyDeparture} from './types';
import {
  canSellCollabTicket,
  getNonFreeLegs,
  getTripPatternAnalytics,
  type TripAnalytics,
} from './utils';
import {formatToClock, secondsBetween} from '@atb/utils/date';
import analytics from '@react-native-firebase/analytics';
import {addMinutes, formatISO, hoursToSeconds, parseISO} from 'date-fns';
import React, {Ref, useCallback} from 'react';
import {View} from 'react-native';
import {Trip} from './components/Trip';
import {useHarbors} from '@atb/modules/harbors';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {useRefreshTripQuery} from '@atb/modules/trip-patterns';
import {getPosthogClientGlobal} from '@atb/modules/analytics';
import {useScreenshotAware} from 'react-native-screenshot-aware';
import {useTimeContext} from '@atb/modules/time';
import {useManualRefreshControlProps} from '@atb/utils/use-manual-refresh-props';
import {TravelCardHeaderComponent as TravelCardHeader} from '@atb/screen-components/travel-card';
import {CompositeAccessibilityProvider} from '@atb/modules/composite-accessibility';
import {LegacyTripDetailsScreenComponent} from './legacy';
import {useIsExperimentalEnabled} from '@atb/modules/experimental';

export type TripDetailsScreenParams = {
  tripPattern: TripPattern;
};

type Props = TripDetailsScreenParams & {
  onPressDetailsMap: (
    params: TravelDetailsMapScreenParams,
    tripAnalytics: TripAnalytics,
  ) => void;
  onPressBuyTicket: (
    params: Root_PurchaseOverviewScreenParams,
    tripAnalytics: TripAnalytics,
  ) => void;
  onPressQuay: (
    stopPlace: StopPlaceFragment,
    selectedQuayId: string | undefined,
    tripAnalytics: TripAnalytics,
  ) => void;
  onPressDeparture: (
    items: ServiceJourneyDeparture[],
    index: number,
    tripAnalytics: TripAnalytics,
  ) => void;
  focusRef: Ref<any>;
  isFocused: boolean;
};

export const TripDetailsScreenComponent = (props: Props) => {
  const isNewScreen = useIsExperimentalEnabled('isNewTripSearchEnabled');
  return isNewScreen ? (
    <NewTripDetailsScreenComponent {...props} />
  ) : (
    <LegacyTripDetailsScreenComponent {...props} />
  );
};

const NewTripDetailsScreenComponent = ({
  tripPattern,
  onPressDetailsMap,
  onPressBuyTicket,
  onPressDeparture,
  onPressQuay,
  focusRef,
  isFocused,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyle();
  const {theme} = useThemeContext();
  const themeColor = theme.color.background.neutral[1];

  const {data, error, isFetching, refetch} = useRefreshTripQuery(
    tripPattern,
    isFocused,
  );

  const updatedTripPattern = data ?? tripPattern;

  const {serverNow} = useTimeContext();
  useTrackScreenshottedTripDetails(updatedTripPattern, serverNow);

  const {fareZones} = useFirestoreConfigurationContext();
  const tripAnalytics = getTripPatternAnalytics(
    updatedTripPattern,
    fareZones,
    serverNow,
  );

  const purchaseSelection = usePurchaseSelectionFromTrip(updatedTripPattern);
  const headerTitle = `${formatToClock(updatedTripPattern.expectedStartTime, language, 'floor')} - ${formatToClock(updatedTripPattern.expectedEndTime, language, 'ceil')}`;

  const refreshControlProps = useManualRefreshControlProps({
    refreshing: isFetching,
    onRefresh: refetch,
  });

  return (
    <View style={styles.container}>
      <FullScreenView
        focusRef={focusRef}
        headerProps={{
          leftButton: {type: 'back'},
          title: headerTitle,
          color: themeColor,
        }}
        refreshControlProps={refreshControlProps}
        contentColor={theme.color.background.neutral[1]}
        headerContent={(focusRef) => (
          <CompositeAccessibilityProvider order={['header']}>
            {(accessibilityProps) => (
              <View
                ref={focusRef}
                style={styles.headerContent}
                {...accessibilityProps}
              >
                <TravelCardHeader
                  tripPattern={updatedTripPattern}
                  size="large"
                />
              </View>
            )}
          </CompositeAccessibilityProvider>
        )}
      >
        {updatedTripPattern && (
          <View style={styles.paddedContainer} testID="tripDetailsContentView">
            <Trip
              tripPattern={updatedTripPattern}
              error={error ?? undefined}
              onPressDetailsMap={(params) =>
                onPressDetailsMap(params, tripAnalytics)
              }
              onPressDeparture={(items, index) =>
                onPressDeparture(items, index, tripAnalytics)
              }
              onPressQuay={(stopPlace, selectedQuayId) =>
                onPressQuay(stopPlace, selectedQuayId, tripAnalytics)
              }
              now={serverNow}
            />
          </View>
        )}
      </FullScreenView>
      {purchaseSelection && (
        <View style={styles.borderTop}>
          <Button
            expanded={true}
            accessibilityRole="button"
            accessibilityLabel={t(TripDetailsTexts.trip.buyTicket.a11yLabel)}
            accessible={true}
            onPress={() => {
              analytics().logEvent('click_trip_purchase_button');
              onPressBuyTicket(
                {
                  selection: purchaseSelection,
                  mode: 'TravelSearch',
                },
                tripAnalytics,
              );
            }}
            text={t(TripDetailsTexts.trip.buyTicket.text)}
            leftIcon={{svg: Ticket}}
            style={styles.purchaseButtonAccessible}
          />
        </View>
      )}
    </View>
  );
};

function usePurchaseSelectionFromTrip(
  tripPattern: TripPattern,
): PurchaseSelectionType | undefined {
  const {enable_ticketing} = useRemoteConfigContext();
  const {
    isFromTravelSearchToTicketEnabled,
    isFromTravelSearchToTicketBoatEnabled,
  } = useFeatureTogglesContext();
  const purchaseSelectionBuilder = usePurchaseSelectionBuilder();
  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const {fareZones} = useFirestoreConfigurationContext();
  const {data: harbors} = useHarbors();

  const hasTooLongWaitTime = totalWaitTimeIsMoreThanAnHour(tripPattern.legs);

  if (
    !enable_ticketing ||
    !isFromTravelSearchToTicketEnabled ||
    hasTooLongWaitTime
  )
    return;

  const nonFreeLegs = getNonFreeLegs(tripPattern.legs);

  if (!nonFreeLegs.length) {
    // Non-transit route, so no tickets needed.
    return;
  }

  const ticketStartTime = calculateTicketStartTime(nonFreeLegs);

  const ticketInfoForBus = getTicketInfoForBus(
    tripPattern,
    nonFreeLegs,
    fareProductTypeConfigs,
    fareZones,
    ticketStartTime,
  );
  if (ticketInfoForBus) {
    return purchaseSelectionBuilder
      .forType(ticketInfoForBus.fareProductTypeConfig.type)
      .fromZone(ticketInfoForBus.fromPlace)
      .toZone(ticketInfoForBus.toPlace)
      .date(ticketInfoForBus.ticketStartTime)
      .build();
  }

  if (!isFromTravelSearchToTicketBoatEnabled) {
    // Boat ticket is disabled, avoid returning any ticket info
    return;
  }

  const ticketInfoForBoat = getTicketInfoForBoat(
    tripPattern,
    nonFreeLegs,
    fareProductTypeConfigs,
    harbors,
    ticketStartTime,
  );
  if (ticketInfoForBoat) {
    return purchaseSelectionBuilder
      .forType(ticketInfoForBoat.fareProductTypeConfig.type)
      .fromStopPlace(ticketInfoForBoat.fromPlace)
      .toStopPlace(ticketInfoForBoat.toPlace)
      .date(ticketInfoForBoat.ticketStartTime)
      .build();
  }
}

function calculateTicketStartTime(legs: Leg[]) {
  if (!legs[0]) return undefined;
  const tripStartWithBuffer = addMinutes(parseISO(legs[0].aimedStartTime), -5);
  return tripStartWithBuffer.getTime() <= Date.now()
    ? undefined
    : formatISO(tripStartWithBuffer);
}

type TicketInfoForBus = {
  fromPlace: FareZoneWithMetadata;
  toPlace: FareZoneWithMetadata;
  ticketStartTime: string | undefined;
  fareProductTypeConfig: FareProductTypeConfig;
};

function getTicketInfoForBus(
  tripPattern: TripPattern,
  nonFreeLegs: Leg[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  fareZones: FareZone[],
  ticketStartTime?: string,
): TicketInfoForBus | undefined {
  const canSellCollab = canSellCollabTicket(tripPattern);
  const hasOnlyValidBusLegs = !hasLegsWeCantSellTicketsFor(tripPattern, [
    'cityTram',
    'expressBus',
    'localBus',
    'localTram',
    'regionalBus',
    'shuttleBus',
  ]);

  if (!hasOnlyValidBusLegs && !canSellCollab) return;

  const fromFareZone = getFareZoneWithMetadata(
    nonFreeLegs[0].fromPlace,
    fareZones,
  );
  const toFareZone = getFareZoneWithMetadata(
    nonFreeLegs[nonFreeLegs.length - 1].toPlace,
    fareZones,
  );

  if (!fromFareZone || !toFareZone) return;

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (config) => config.type === 'single',
  );
  if (!fareProductTypeConfig) return;

  return {
    fromPlace: fromFareZone,
    toPlace: toFareZone,
    ticketStartTime,
    fareProductTypeConfig,
  };
}

type TicketInfoForBoat = {
  fromPlace: StopPlaceFragment;
  toPlace: StopPlaceFragment;
  ticketStartTime: string | undefined;
  fareProductTypeConfig: FareProductTypeConfig;
};

function getTicketInfoForBoat(
  tripPattern: TripPattern,
  nonHumanLegs: Leg[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  harbors: StopPlaceFragment[],
  ticketStartTime?: string,
): TicketInfoForBoat | undefined {
  const hasOnlyValidBoatLegs = !hasLegsWeCantSellTicketsFor(tripPattern, [
    'highSpeedPassengerService',
    'highSpeedVehicleService',
  ]);

  if (!hasOnlyValidBoatLegs) return;

  const fromHarbor = harbors.find(
    (harbor) => harbor.id === nonHumanLegs[0]?.fromPlace.quay?.stopPlace?.id,
  );
  const toHarbor = harbors.find(
    (harbor) =>
      harbor.id ===
      nonHumanLegs[nonHumanLegs.length - 1]?.toPlace.quay?.stopPlace?.id,
  );

  if (!fromHarbor || !toHarbor) return;

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (config) => config.type === 'boat-single',
  );
  if (!fareProductTypeConfig) return;

  return {
    fromPlace: fromHarbor,
    toPlace: toHarbor,
    ticketStartTime,
    fareProductTypeConfig,
  };
}

function getFareZoneWithMetadata(place: Place, fareZones: FareZone[]) {
  const firstFareZoneWeSellTicketFor = getFirstFareZoneWeSellTicketFor(
    fareZones,
    place.quay?.tariffZones,
  );

  if (!firstFareZoneWeSellTicketFor) return;

  const fareZoneWithMetadata: FareZoneWithMetadata = {
    resultType: 'zone',
    venueName: place.name,
    ...firstFareZoneWeSellTicketFor,
  };

  return fareZoneWithMetadata;
}

function totalWaitTimeIsMoreThanAnHour(legs: Leg[]) {
  return (
    legs.reduce(
      (sum, leg, currentIndex) =>
        sum + getWaitTime(leg, legs[currentIndex + 1]),
      0,
    ) >= hoursToSeconds(1)
  );
}

function getWaitTime(leg: Leg, nextLeg: Leg) {
  return nextLeg
    ? secondsBetween(leg.expectedEndTime, nextLeg.expectedStartTime)
    : 0;
}

function getFirstFareZoneWeSellTicketFor(
  fareZones: FareZone[],
  tripFareZones?: {id: string; name?: string}[],
): FareZone | undefined {
  if (!tripFareZones) return;

  // match fare zone to zones in reference data to find zones we sell tickets for
  const matchingZones = fareZones.filter((referenceFareZone) =>
    tripFareZones.find((z2) => referenceFareZone.id === z2.id),
  );

  if (!matchingZones[0]) return;

  return matchingZones[0];
}

function useTrackScreenshottedTripDetails(
  tripPattern: TripPattern,
  now: number,
) {
  const {fareZones} = useFirestoreConfigurationContext();

  const screenshotCallback = useCallback(() => {
    trackScreenshottedTripDetails(tripPattern, fareZones, now);
  }, [tripPattern, fareZones, now]);

  useScreenshotAware(screenshotCallback);
}

function trackScreenshottedTripDetails(
  tripPattern: TripPattern,
  fareZones: FareZone[],
  now: number,
) {
  const posthogClient = getPosthogClientGlobal();
  if (!posthogClient) return;

  posthogClient.capture(
    'TripDetailsScreenshotTaken',
    getTripPatternAnalytics(tripPattern, fareZones, now),
  );
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  headerContent: {
    marginHorizontal: theme.spacing.medium,
  },
  paddedContainer: {
    padding: theme.spacing.medium,
  },
  purchaseButtonAccessible: {
    marginHorizontal: theme.spacing.medium,
    marginVertical: theme.spacing.xSmall,
  },
  borderTop: {
    borderTopColor: theme.color.border.primary.background,
    borderTopWidth: theme.border.width.slim,
  },
}));
