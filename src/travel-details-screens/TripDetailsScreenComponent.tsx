import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {Leg, Place, TripPattern} from '@atb/api/types/trips';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import SvgDuration from '@atb/assets/svg/mono-icons/time/Duration';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {hasLegsWeCantSellTicketsFor} from '@atb/operator-config';
import {
  FareProductTypeConfig,
  TariffZone,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
// eslint-disable-next-line no-restricted-imports
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {useFromTravelSearchToTicketEnabled} from './use_from_travel_search_to_ticket_enabled';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {Language, TripDetailsTexts, useTranslation} from '@atb/translations';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {useCurrentTripPatternWithUpdates} from '@atb/travel-details-screens/use-current-trip-pattern-with-updates';
import {canSellCollabTicket} from '@atb/travel-details-screens/utils';
import {formatToClock, secondsBetween} from '@atb/utils/date';
import analytics from '@react-native-firebase/analytics';
import {addMinutes, formatISO, hoursToSeconds, parseISO} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import {Trip} from './components/Trip';
import {useHarbors} from '@atb/harbors';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

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

  const {updatedTripPattern, error} =
    useCurrentTripPatternWithUpdates(tripPattern);

  const tripTicketDetails = useTicketInfoFromTrip(updatedTripPattern);
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
                type="heading--medium"
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
                colorType={themeColor}
              />
              <ThemeText
                type="body__secondary"
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
      {tripTicketDetails && (
        <View style={styles.borderTop}>
          <Button
            accessibilityRole="button"
            accessibilityLabel={t(TripDetailsTexts.trip.buyTicket.a11yLabel)}
            accessible={true}
            onPress={() => {
              analytics().logEvent('click_trip_purchase_button');
              onPressBuyTicket({
                fareProductTypeConfig: tripTicketDetails.fareProductTypeConfig,
                fromPlace: tripTicketDetails.fromPlace,
                toPlace: tripTicketDetails.toPlace,
                travelDate: tripTicketDetails.ticketStartTime,
                datedServiceJourneyIds:
                  tripTicketDetails.datedServiceJourneyIds,
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

function useTicketInfoFromTrip(
  tripPattern: TripPattern,
): TicketInfoForBus | TicketInfoForBoat | undefined {
  const {enable_ticketing} = useRemoteConfig();
  const isFromTravelSearchToTicketEnabled =
    useFromTravelSearchToTicketEnabled();
  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const {tariffZones} = useFirestoreConfiguration();
  const {data: harbors} = useHarbors();

  const hasTooLongWaitTime = totalWaitTimeIsMoreThanAnHour(tripPattern.legs);

  if (
    !enable_ticketing ||
    !isFromTravelSearchToTicketEnabled ||
    hasTooLongWaitTime
  )
    return;

  const nonHumanLegs = getNonHumanLegs(tripPattern.legs);
  const ticketStartTime = calculateTicketStartTime(nonHumanLegs);

  const ticketInfoForBus = getTicketInfoForBus(
    tripPattern,
    nonHumanLegs,
    fareProductTypeConfigs,
    tariffZones,
    ticketStartTime,
  );
  if (ticketInfoForBus) return ticketInfoForBus;

  const ticketInfoForBoat = getTicketInfoForBoat(
    tripPattern,
    nonHumanLegs,
    fareProductTypeConfigs,
    harbors,
    ticketStartTime,
  );
  if (ticketInfoForBoat) return ticketInfoForBoat;
}

function getNonHumanLegs(legs: Leg[]) {
  return legs.filter(
    (leg) => leg.mode !== Mode.Foot && leg.mode !== Mode.Bicycle,
  );
}

function calculateTicketStartTime(legs: Leg[]) {
  const tripStartWithBuffer = addMinutes(parseISO(legs[0]?.aimedStartTime), -5);
  return tripStartWithBuffer.getTime() <= Date.now()
    ? undefined
    : formatISO(tripStartWithBuffer);
}

type TicketInfoForBus = {
  fromPlace: TariffZoneWithMetadata;
  toPlace: TariffZoneWithMetadata;
  ticketStartTime: string | undefined;
  fareProductTypeConfig: FareProductTypeConfig;
  datedServiceJourneyIds: string[];
};

function getTicketInfoForBus(
  tripPattern: TripPattern,
  nonHumanLegs: Leg[],
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
    nonHumanLegs[0].fromPlace,
    tariffZones,
  );
  const toTariffZone = getTariffZoneWithMetadata(
    nonHumanLegs[nonHumanLegs.length - 1].toPlace,
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
    datedServiceJourneyIds: getDatedServiceJourneyIds(tripPattern),
  };
}

type TicketInfoForBoat = {
  fromPlace: StopPlaceFragment;
  toPlace: StopPlaceFragment;
  ticketStartTime: string | undefined;
  fareProductTypeConfig: FareProductTypeConfig;
  datedServiceJourneyIds: string[];
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
    datedServiceJourneyIds: getDatedServiceJourneyIds(tripPattern),
  };
}

function getDatedServiceJourneyIds(tripPattern: TripPattern): string[] {
  return tripPattern.legs
    .map((leg) => leg.datedServiceJourney?.id)
    .filter(Boolean) as string[];
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
    backgroundColor: theme.static.background.background_0.background,
  },
  heading: {marginBottom: theme.spacings.medium},
  parallaxContent: {marginHorizontal: theme.spacings.medium},
  paddedContainer: {
    paddingHorizontal: theme.spacings.medium,
  },
  purchaseButton: {
    position: 'absolute',
    marginHorizontal: theme.spacings.large,
    marginBottom: theme.spacings.large,
    bottom: 0,
    right: 0,
    shadowRadius: theme.spacings.small,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
  },
  purchaseButtonAccessible: {
    marginHorizontal: theme.spacings.medium,
    marginVertical: theme.spacings.xSmall,
  },
  borderTop: {
    borderTopColor: theme.border.primary,
    borderTopWidth: theme.border.width.slim,
  },
  durationIcon: {marginRight: theme.spacings.small},
}));
