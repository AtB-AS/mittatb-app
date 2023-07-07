import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import SvgDuration from '@atb/assets/svg/mono-icons/time/Duration';
import {Button} from '@atb/components/button';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {hasLegsWeCantSellTicketsFor} from '@atb/operator-config';
import {TariffZone} from '@atb/reference-data/types';
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
import {MapFilterType} from '@atb/components/map';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type TripDetailsScreenParams = {
  tripPattern: TripPattern;
  mapFilter?: MapFilterType;
};

type Props = TripDetailsScreenParams & {
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressBuyTicket: (params: Root_PurchaseOverviewScreenParams) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
  onPressDeparture: (items: ServiceJourneyDeparture[], index: number) => void;
};

export const TripDetailsScreenComponent = ({
  tripPattern,
  mapFilter,
  onPressDetailsMap,
  onPressBuyTicket,
  onPressDeparture,
  onPressQuay,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyle();

  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const singleTicketConfig = fareProductTypeConfigs.find(
    (fareProductTypeConfig) => fareProductTypeConfig.type === 'single',
  );

  const {updatedTripPattern, error} =
    useCurrentTripPatternWithUpdates(tripPattern);

  const tripTicketDetails = useGetTicketInfoFromTrip(updatedTripPattern);
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
        parallaxContent={(focusRef?: React.MutableRefObject<null>) => (
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
              onPressDetailsMap={(params) =>
                onPressDetailsMap({...params, mapFilter})
              }
              onPressDeparture={onPressDeparture}
              onPressQuay={onPressQuay}
            />
          </View>
        )}
      </FullScreenView>
      {tripTicketDetails && singleTicketConfig && (
        <View style={styles.borderTop}>
          <Button
            accessibilityRole={'button'}
            accessibilityLabel={t(TripDetailsTexts.trip.buyTicket.a11yLabel)}
            accessible={true}
            onPress={() => {
              analytics().logEvent('click_trip_purchase_button');
              onPressBuyTicket({
                fareProductTypeConfig: singleTicketConfig,
                fromTariffZone: tripTicketDetails.tariffZoneFrom,
                toTariffZone: tripTicketDetails.tariffZoneTo,
                travelDate: tripTicketDetails.ticketStartTime,
                mode: 'TravelSearch',
              });
            }}
            type="block"
            text={t(TripDetailsTexts.trip.buyTicket.text)}
            rightIcon={{svg: Ticket}}
            style={styles.purchaseButtonAccessible}
          />
        </View>
      )}
    </View>
  );
};

function useGetTicketInfoFromTrip(tripPattern: TripPattern) {
  const fromTripsSearchToTicketEnabled = useFromTravelSearchToTicketEnabled();
  const {enable_ticketing} = useRemoteConfig();

  const nonFootLegs = tripPattern.legs.filter((leg) => leg.mode !== Mode.Foot);
  const fromTariffZones = nonFootLegs[0]?.fromPlace.quay?.tariffZones;
  const toTariffZones =
    nonFootLegs[nonFootLegs.length - 1]?.toPlace.quay?.tariffZones;
  const fromTariffZoneWeSellSingleTicketsFor =
    useGetFirstTariffZoneWeSellTicketFor(fromTariffZones);
  const toTariffZoneWeSellTicketFor =
    useGetFirstTariffZoneWeSellTicketFor(toTariffZones);

  const hasTooLongWaitTime = totalWaitTimeIsMoreThanAnHour(tripPattern.legs);
  const canSellCollab = canSellCollabTicket(tripPattern);

  if (
    !(
      fromTripsSearchToTicketEnabled &&
      fromTariffZoneWeSellSingleTicketsFor &&
      toTariffZoneWeSellTicketFor
    ) ||
    hasTooLongWaitTime
  )
    return;

  const tariffZoneTo: TariffZoneWithMetadata = {
    resultType: 'zone',
    venueName: nonFootLegs[nonFootLegs.length - 1]?.toPlace?.name,
    ...toTariffZoneWeSellTicketFor,
  };
  const tariffZoneFrom: TariffZoneWithMetadata = {
    resultType: 'zone',
    venueName: nonFootLegs[0]?.fromPlace?.name,
    ...fromTariffZoneWeSellSingleTicketsFor,
  };

  // modes we can sell single tickets for. Might not always match modes we sell tickets for,
  // as from travel search to ticket currently only supports single ticket
  const someLegsAreNotSingleTicket = hasLegsWeCantSellTicketsFor(tripPattern, [
    'cityTram',
    'expressBus',
    'localBus',
    'localTram',
    'regionalBus',
    'shuttleBus',
  ]);
  if (!enable_ticketing || (someLegsAreNotSingleTicket && !canSellCollab))
    return;

  const tripStartWithBuffer = addMinutes(
    parseISO(nonFootLegs[0]?.aimedStartTime),
    -5,
  );
  const ticketStartTime =
    tripStartWithBuffer.getTime() <= Date.now()
      ? undefined
      : formatISO(tripStartWithBuffer);

  return {
    tariffZoneFrom,
    tariffZoneTo,
    ticketStartTime,
  };
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

function useGetFirstTariffZoneWeSellTicketFor(
  tripTariffZones?: {id: string; name?: string}[],
): TariffZone | undefined {
  const {tariffZones: referenceTariffZones} = useFirestoreConfiguration();

  if (!tripTariffZones) return;

  // match tariff zone to zones in reference data to find zones we sell tickets for
  const matchingZones = referenceTariffZones.filter((referenceTariffZone) =>
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
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacings.medium,
    marginVertical: theme.spacings.xSmall,
    flexDirection: 'row',
  },
  borderTop: {
    borderTopColor: theme.border.primary,
    borderTopWidth: theme.border.width.slim,
  },
  durationIcon: {marginRight: theme.spacings.small},
}));
