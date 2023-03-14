import {Leg, TripPattern} from '@atb/api/types/trips';
import {ContentWithDisappearingHeader} from '@atb/components/disappearing-header';
import {ScreenHeader} from '@atb/components/screen-header';
import PaginatedDetailsHeader from '@atb/travel-details-screens/components/PaginatedDetailsHeader';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Trip from './components/Trip';
import {
  CompactTravelDetailsMap,
  TravelDetailsMapScreenParams,
} from '@atb/travel-details-map-screen';
import {useCurrentTripPatternWithUpdates} from '@atb/travel-details-screens/use-current-trip-pattern-with-updates';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {Button} from '@atb/components/button';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import {useFromTravelSearchToTicketEnabled} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use_from_travel_search_to_ticket_enabled';
import {hasLegsWeCantSellTicketsFor} from '@atb/operator-config';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {Root_PurchaseOverviewScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen';
import {TariffZone} from '@atb/reference-data/types';
import {addMinutes, formatISO, hoursToSeconds, parseISO} from 'date-fns';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import analytics from '@react-native-firebase/analytics';
import {canSellCollabTicket} from '@atb/travel-details-screens/utils';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {secondsBetween} from '@atb/utils/date';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type TripDetailsScreenParams = {
  tripPatterns: TripPattern[];
  startIndex?: number;
};

type Props = TripDetailsScreenParams & {
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressBuyTicket: (params: Root_PurchaseOverviewScreenParams) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
  onPressDeparture: (items: ServiceJourneyDeparture[], index: number) => void;
};

export const TripDetailsScreenComponent = ({
  tripPatterns,
  startIndex,
  onPressDetailsMap,
  onPressBuyTicket,
  onPressDeparture,
  onPressQuay,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyle();

  const [currentIndex, setCurrentIndex] = useState(startIndex ?? 0);
  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const singleTicketConfig = fareProductTypeConfigs.find(
    (fareProductTypeConfig) => fareProductTypeConfig.type === 'single',
  );

  const {tripPattern, error} = useCurrentTripPatternWithUpdates(
    currentIndex,
    tripPatterns,
  );
  function navigate(page: number) {
    const newIndex = page - 1;
    if (page > tripPatterns.length || page < 1 || currentIndex === newIndex) {
      return;
    }
    setCurrentIndex(newIndex);
  }

  const {top: paddingTop} = useSafeAreaInsets();

  const tripTicketDetails = useGetTicketInfoFromTrip(tripPattern);
  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop}]}>
        <ScreenHeader
          leftButton={{type: 'back'}}
          title={t(TripDetailsTexts.header.title)}
          color={themeColor}
        />
      </View>
      <ContentWithDisappearingHeader
        header={
          tripPattern?.legs && (
            <CompactTravelDetailsMap
              mapLegs={tripPattern.legs}
              fromPlace={tripPattern.legs[0].fromPlace}
              toPlace={tripPattern.legs[tripPattern.legs.length - 1].toPlace}
              onExpand={() => {
                onPressDetailsMap({
                  legs: tripPattern.legs,
                  fromPlace: tripPattern.legs[0].fromPlace,
                  toPlace:
                    tripPattern.legs[tripPattern.legs.length - 1].toPlace,
                });
              }}
            />
          )
        }
      >
        {tripPattern && (
          <View style={styles.paddedContainer} testID="tripDetailsContentView">
            {tripPatterns.length > 1 && (
              <PaginatedDetailsHeader
                page={currentIndex + 1}
                totalPages={tripPatterns.length}
                onNavigate={navigate}
                style={styles.pagination}
                currentDate={tripPattern.legs[0]?.aimedStartTime}
              />
            )}
            <Trip
              tripPattern={tripPattern}
              error={error}
              onPressDeparture={onPressDeparture}
              onPressQuay={onPressQuay}
            />
          </View>
        )}
      </ContentWithDisappearingHeader>
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

function totalWaitTimeIsMoreThanAnHour(legs: Leg[]) {
  return (
    legs.reduce(
      (sum, leg, currentIndex) =>
        sum + getWaitTime(leg, legs[currentIndex + 1]),
      0,
    ) >= hoursToSeconds(1)
  );
}

function getWaitTime(leg: Leg, nextLeg?: Leg) {
  return nextLeg
    ? secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime)
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
  header: {
    backgroundColor: theme.static.background[themeColor].background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_0.background,
  },
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
  pagination: {
    marginVertical: theme.spacings.medium,
  },
}));
