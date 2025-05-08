import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {Leg, Place, TripPattern} from '@atb/api/types/trips';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import SvgDuration from '@atb/assets/svg/mono-icons/time/Duration';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {hasLegsWeCantSellTicketsFor} from '@atb/modules/operator-config';
import {
  FareProductTypeConfig,
  TariffZone,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
// eslint-disable-next-line no-restricted-imports
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Language, TripDetailsTexts, useTranslation} from '@atb/translations';
import {TravelDetailsMapScreenParams} from '@atb/screen-components/travel-details-map-screen';
import {ServiceJourneyDeparture} from './types';
import {useCurrentTripPatternWithUpdates} from './use-current-trip-pattern-with-updates';
import {canSellCollabTicket, getNonFreeLegs} from './utils';
import {formatToClock, secondsBetween} from '@atb/utils/date';
import analytics from '@react-native-firebase/analytics';
import {addMinutes, formatISO, hoursToSeconds, parseISO} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import {Trip} from './components/Trip';
import {useHarbors} from '@atb/modules/harbors';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';

export type TripDetailsScreenParams = {
  tripPattern: TripPattern;
};

type Props = TripDetailsScreenParams & {
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressBuyTicket: (params: Root_PurchaseOverviewScreenParams) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
  onPressDeparture: (items: ServiceJourneyDeparture[], index: number) => void;
};

export const TripDetailsScreenComponent = ({
  tripPattern,
  onPressDetailsMap,
  onPressBuyTicket,
  onPressDeparture,
  onPressQuay,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyle();
  const {theme} = useThemeContext();
  const themeColor = theme.color.background.accent[0];

  const {updatedTripPattern, error} =
    useCurrentTripPatternWithUpdates(tripPattern);

  const purchaseSelection = usePurchaseSelectionFromTrip(updatedTripPattern);
  const fromToNames = getFromToName(updatedTripPattern.legs);
  const startEndTime = getStartEndTime(updatedTripPattern, language);

  return (
    <View style={styles.container}>
      <FullScreenView
        headerProps={{
          leftButton: {type: 'back', withIcon: true},
          title: t(TripDetailsTexts.header.title),
          color: themeColor,
        }}
        parallaxContent={(focusRef) => (
          <View style={styles.parallaxContent}>
            <View accessible={true} ref={focusRef}>
              <ThemeText
                color={themeColor}
                typography="heading--medium"
                style={styles.heading}
                accessibilityLabel={
                  fromToNames
                    ? t(
                        TripDetailsTexts.header.titleFromToA11yLabel(
                          fromToNames,
                        ),
                      )
                    : undefined
                }
              >
                {fromToNames
                  ? t(TripDetailsTexts.header.titleFromTo(fromToNames))
                  : t(TripDetailsTexts.header.title)}
              </ThemeText>
            </View>
            <View style={{flexDirection: 'row'}} accessible={true}>
              <ThemeIcon
                svg={SvgDuration}
                style={styles.durationIcon}
                color={themeColor}
              />
              <ThemeText
                typography="body__secondary"
                color={themeColor}
                accessibilityLabel={t(
                  TripDetailsTexts.header.startEndTimeA11yLabel(startEndTime),
                )}
              >
                {t(TripDetailsTexts.header.startEndTime(startEndTime))}
              </ThemeText>
            </View>
          </View>
        )}
      >
        {updatedTripPattern && (
          <View style={styles.paddedContainer} testID="tripDetailsContentView">
            <Trip
              tripPattern={updatedTripPattern}
              error={error}
              onPressDetailsMap={onPressDetailsMap}
              onPressDeparture={onPressDeparture}
              onPressQuay={onPressQuay}
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
              onPressBuyTicket({
                selection: purchaseSelection,
                mode: 'TravelSearch',
              });
            }}
            text={t(TripDetailsTexts.trip.buyTicket.text)}
            rightIcon={{svg: Ticket}}
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
  const {tariffZones} = useFirestoreConfigurationContext();
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
    tariffZones,
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
  fromPlace: TariffZoneWithMetadata;
  toPlace: TariffZoneWithMetadata;
  ticketStartTime: string | undefined;
  fareProductTypeConfig: FareProductTypeConfig;
};

function getTicketInfoForBus(
  tripPattern: TripPattern,
  nonFreeLegs: Leg[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  tariffZones: TariffZone[],
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

  const fromTariffZone = getTariffZoneWithMetadata(
    nonFreeLegs[0].fromPlace,
    tariffZones,
  );
  const toTariffZone = getTariffZoneWithMetadata(
    nonFreeLegs[nonFreeLegs.length - 1].toPlace,
    tariffZones,
  );

  if (!fromTariffZone || !toTariffZone) return;

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (config) => config.type === 'single',
  );
  if (!fareProductTypeConfig) return;

  return {
    fromPlace: fromTariffZone,
    toPlace: toTariffZone,
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

function getTariffZoneWithMetadata(place: Place, tariffZones: TariffZone[]) {
  const firstTariffZoneWeSellTicketFor = getFirstTariffZoneWeSellTicketFor(
    tariffZones,
    place.quay?.tariffZones,
  );

  if (!firstTariffZoneWeSellTicketFor) return;

  const tariffZoneWithMetadata: TariffZoneWithMetadata = {
    resultType: 'zone',
    venueName: place.name,
    ...firstTariffZoneWeSellTicketFor,
  };

  return tariffZoneWithMetadata;
}

function getFromToName(legs: Leg[]) {
  if (legs.length === 0) return;
  const fromName = legs[0].fromPlace.name;
  const toName = legs[legs.length - 1].toPlace.name;
  if (!fromName || !toName) return;
  return {fromName, toName};
}

function getStartEndTime(tripPattern: TripPattern, language: Language) {
  const startTime = formatToClock(
    tripPattern.expectedStartTime,
    language,
    'floor',
  );
  const endTime = formatToClock(tripPattern.expectedEndTime, language, 'ceil');
  return {startTime, endTime};
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

function getFirstTariffZoneWeSellTicketFor(
  tariffZones: TariffZone[],
  tripTariffZones?: {id: string; name?: string}[],
): TariffZone | undefined {
  if (!tripTariffZones) return;

  // match tariff zone to zones in reference data to find zones we sell tickets for
  const matchingZones = tariffZones.filter((referenceTariffZone) =>
    tripTariffZones.find((z2) => referenceTariffZone.id === z2.id),
  );

  if (!matchingZones[0]) return;

  return matchingZones[0];
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[0].background,
  },
  heading: {marginBottom: theme.spacing.medium},
  parallaxContent: {marginHorizontal: theme.spacing.medium},
  paddedContainer: {
    padding: theme.spacing.medium,
  },
  purchaseButton: {
    position: 'absolute',
    marginHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.large,
    bottom: 0,
    right: 0,
    shadowRadius: theme.spacing.small,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
  },
  purchaseButtonAccessible: {
    marginHorizontal: theme.spacing.medium,
    marginVertical: theme.spacing.xSmall,
  },
  borderTop: {
    borderTopColor: theme.color.border.primary.background,
    borderTopWidth: theme.border.width.slim,
  },
  durationIcon: {marginRight: theme.spacing.small},
}));
