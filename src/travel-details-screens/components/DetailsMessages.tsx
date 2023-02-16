import {getAxiosErrorType} from '@atb/api/utils';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {MessageBox} from '@atb/components/message-box';
import {
  DetailsMessages,
  dictionary,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {AxiosError} from 'axios';
import React from 'react';
import {ViewStyle} from 'react-native';
import {
  canSellTicketsForSubMode,
  hasLegsWeCantSellTicketsFor,
} from '@atb/operator-config';
import {TripPattern} from '@atb/api/types/trips';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {
  Mode,
  TariffZone,
  TransportMode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {hasShortWaitTime} from '@atb/travel-details-screens/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {TransportSubmode} from '@entur/sdk/lib/journeyPlanner/types';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StyleSheet} from '@atb/theme';
import {EstimatedCallWithMetadata} from '@atb/travel-details-screens/use-departure-data';
import FlexibleTransportText from '@atb/translations/components/FlexibleTransportDetails';
import FlexibleTransportContactDetails, {
  BookingDetails,
} from './FlexibeTransportContactDetails';
import {useBottomSheet} from '@atb/components/bottom-sheet';

type TripMessagesProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
  messageStyle?: ViewStyle;
};
export const TripMessages: React.FC<TripMessagesProps> = ({
  tripPattern,
  error,
}) => {
  const {t, language} = useTranslation();
  const {open: openBottomSheet} = useBottomSheet();
  const {modesWeSellTicketsFor} = useFirestoreConfiguration();
  const someTicketsAreUnavailableInApp = hasLegsWeCantSellTicketsFor(
    tripPattern,
    modesWeSellTicketsFor,
  );
  const styles = useStyles();
  const canUseCollabTicket = someLegsAreByTrain(tripPattern);
  const shortWaitTime = hasShortWaitTime(tripPattern.legs);
  const leg = tripPattern.legs.filter((leg) => leg.bookingArrangements).shift();

  const {enable_ticketing} = useRemoteConfig();
  const isTicketingEnabledAndSomeTicketsAreUnavailableInApp =
    enable_ticketing && someTicketsAreUnavailableInApp;
  const tripIncludesRailReplacementBus = tripPattern.legs.some(
    (leg) => leg.transportSubmode === TransportSubmode.RailReplacementBus,
  );
  const tariffZonesHaveZoneA = (tariffZones?: TariffZone[]) =>
    tariffZones?.some((a) => a.id === 'ATB:TariffZone:1');

  const allLegsInZoneA = tripPattern.legs
    .filter((a) => a.mode !== Mode.Foot)
    .every(
      (a) =>
        tariffZonesHaveZoneA(a.fromPlace.quay?.tariffZones) &&
        tariffZonesHaveZoneA(a.toPlace.quay?.tariffZones),
    );

  const contactDetails: BookingDetails | undefined = leg?.bookingArrangements
    ?.bookingContact?.phone &&
    leg.aimedEndTime && {
      phoneNumber: leg.bookingArrangements.bookingContact.phone,
      aimedStartTime: leg.aimedEndTime,
    };

  const openContactFlexibleTransport = (contactDetails: BookingDetails) => {
    openBottomSheet((close, focusRef) => (
      <FlexibleTransportContactDetails
        close={close}
        contactDetails={contactDetails}
        ref={focusRef}
      />
    ));
  };

  return (
    <>
      {tripIncludesRailReplacementBus && (
        <MessageBox
          style={styles.messageBox}
          type="warning"
          message={t(TripDetailsTexts.messages.tripIncludesRailReplacementBus)}
        />
      )}
      {shortWaitTime && (
        <MessageBox
          style={styles.messageBox}
          type="info"
          message={t(TripDetailsTexts.messages.shortTime)}
        />
      )}
      {isTicketingEnabledAndSomeTicketsAreUnavailableInApp && (
        <MessageBox
          style={styles.messageBox}
          type="info"
          message={
            canUseCollabTicket && allLegsInZoneA
              ? t(DetailsMessages.messages.collabTicketInfo)
              : t(DetailsMessages.messages.ticketsWeDontSell)
          }
        />
      )}
      {contactDetails && (
        <MessageBox
          type="warning"
          title={t(
            TripDetailsTexts.trip.leg.contactFlexibleTransportTitle(
              contactDetails.phoneNumber,
            ),
          )}
          message={t(
            FlexibleTransportText.infoMessage(
              contactDetails.aimedStartTime,
              language,
            ),
          )}
          onPressConfig={{
            text: t(dictionary.seeMore),
            action: () => {
              openContactFlexibleTransport(contactDetails);
            },
          }}
        />
      )}
      {error && (
        <>
          <ScreenReaderAnnouncement message={translatedError(error, t)} />
          <MessageBox
            style={styles.messageBox}
            type="warning"
            message={translatedError(error, t)}
          />
        </>
      )}
    </>
  );
};
function translatedError(error: AxiosError, t: TranslateFunction): string {
  const errorType = getAxiosErrorType(error);
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(TripDetailsTexts.messages.errorNetwork);
    default:
      return t(TripDetailsTexts.messages.errorDefault);
  }
}

function someLegsAreByTrain(tripPattern: TripPattern): boolean {
  return tripPattern.legs.some((leg) => leg.mode === Mode.Rail);
}

type TicketingMessagesProps = {
  item: ServiceJourneyDeparture;
  trip: EstimatedCallWithMetadata[];
  mode: TransportMode | undefined;
  subMode: TransportSubmode | undefined;
};

export function TicketingMessages({
  item,
  mode,
  subMode,
  trip,
}: TicketingMessagesProps): JSX.Element | null {
  const {t} = useTranslation();
  const styles = useStyles();

  const {modesWeSellTicketsFor} = useFirestoreConfiguration();
  const {enable_ticketing} = useRemoteConfig();
  const canSellTicketsForDeparture = canSellTicketsForSubMode(
    subMode,
    modesWeSellTicketsFor,
  );
  if (!enable_ticketing || canSellTicketsForDeparture) return null;

  const tariffZonesHaveZoneA = (tariffZones?: TariffZone[]) =>
    tariffZones?.some((a) => a.id === 'ATB:TariffZone:1');

  const toQuay = trip.find(
    (estimatedCall) => estimatedCall.quay?.id === item.toQuayId,
  );
  const fromQuay = trip.find(
    (estimatedCall) => estimatedCall.quay?.id === item.fromQuayId,
  );
  const someLegsAreByTrain = mode === TransportMode.Rail;

  const startsInZoneA = tariffZonesHaveZoneA(fromQuay?.quay?.tariffZones);
  const stopsInZoneA = tariffZonesHaveZoneA(toQuay?.quay?.tariffZones);

  const CollabTicketMessage = (
    <MessageBox
      style={styles.messageBox}
      type="info"
      message={t(DetailsMessages.messages.collabTicketInfo)}
    />
  );

  const TrainOutsideZoneAMessage = (
    <MessageBox
      style={styles.messageBox}
      type="info"
      message={t(DetailsMessages.messages.trainOutsideZoneA)}
    />
  );

  const TicketsWeDontSellMessage = (
    <MessageBox
      style={styles.messageBox}
      type="info"
      message={t(DetailsMessages.messages.ticketsWeDontSell)}
    />
  );

  if (someLegsAreByTrain) {
    if (startsInZoneA && toQuay?.quay && stopsInZoneA)
      return CollabTicketMessage;
    if (startsInZoneA && !toQuay?.quay)
      return (
        <>
          {CollabTicketMessage}
          {TrainOutsideZoneAMessage}
        </>
      );
  }
  return TicketsWeDontSellMessage;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
}));
