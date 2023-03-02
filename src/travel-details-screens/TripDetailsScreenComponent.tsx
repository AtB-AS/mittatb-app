import {TripPattern} from '@atb/api/types/trips';
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
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';
import {addMinutes, formatISO, parseISO} from 'date-fns';

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
  const fromTripsSearchToTicketEnabled = useFromTravelSearchToTicketEnabled();
  const {modesWeSellTicketsFor} = useFirestoreConfiguration();

  const nonFootLegs = tripPattern.legs.filter((leg) => leg.mode !== 'foot');

  const fromNonFootLeg = nonFootLegs[0];
  const fromTariffZones = fromNonFootLeg?.fromPlace.quay?.tariffZones;
  const tariffZoneFrom = useGetFirstTariffZoneWeSellTicketFor(fromTariffZones);

  const toNonFootLeg = nonFootLegs[nonFootLegs.length - 1];
  const toTariffZones = toNonFootLeg?.toPlace.quay?.tariffZones;
  const tariffZoneTo = useGetFirstTariffZoneWeSellTicketFor(toTariffZones);

  function navigate(page: number) {
    const newIndex = page - 1;
    if (page > tripPatterns.length || page < 1 || currentIndex === newIndex) {
      return;
    }
    setCurrentIndex(newIndex);
  }

  const someTicketsAreUnavailableInApp = hasLegsWeCantSellTicketsFor(
    tripPattern,
    modesWeSellTicketsFor,
  );

  const {enable_ticketing} = useRemoteConfig();
  const isTicketingEnabledAndTicketsAreAvailableInApp =
    enable_ticketing && !someTicketsAreUnavailableInApp;

  const {top: paddingTop} = useSafeAreaInsets();

  const screenReaderEnabled = useIsScreenReaderEnabled();

  const tripStartTime = parseISO(tripPattern.expectedStartTime);
  const tripStartWithBuffer = addMinutes(tripStartTime, -5);
  const ticketStartTime =
    tripStartWithBuffer.getTime() <= Date.now()
      ? undefined
      : formatISO(tripStartWithBuffer);

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
      {fromTripsSearchToTicketEnabled &&
        isTicketingEnabledAndTicketsAreAvailableInApp &&
        singleTicketConfig &&
        tariffZoneFrom &&
        tariffZoneTo && (
          <View style={screenReaderEnabled ? styles.borderTop : undefined}>
            <Button
              accessibilityRole={'button'}
              accessibilityLabel={t(TripDetailsTexts.trip.buyTicket.a11yLabel)}
              accessible={true}
              onPress={() =>
                onPressBuyTicket({
                  fareProductTypeConfig: singleTicketConfig,
                  fromTariffZone: {resultType: 'zone', ...tariffZoneFrom},
                  toTariffZone: {resultType: 'zone', ...tariffZoneTo},
                  travelDate: ticketStartTime,
                })
              }
              type={screenReaderEnabled ? 'block' : 'inline'}
              text={t(TripDetailsTexts.trip.buyTicket.text)}
              rightIcon={{svg: Ticket}}
              style={
                screenReaderEnabled
                  ? styles.purchaseButtonAccessible
                  : styles.purchaseButton
              }
            />
          </View>
        )}
    </View>
  );
};

function useGetFirstTariffZoneWeSellTicketFor(
  tripTariffZones?: {id: string; name?: string}[],
): TariffZone | undefined {
  const {tariffZones: referenceTariffZones} = useFirestoreConfiguration();

  if (!tripTariffZones) return;

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
