import {getAxiosErrorType} from '@atb/api/utils';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import MessageBox from '@atb/components/message-box';
import {
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {AxiosError} from 'axios';
import React from 'react';
import {ViewStyle} from 'react-native';
import {hasLegsWeCantSellTicketsFor} from '@atb/operator-config';
import {TripPattern} from '@atb/api/types/trips';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {hasShortWaitTime} from '@atb/screens/TripDetails/components/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {TransportSubmode} from '@entur/sdk/lib/journeyPlanner/types';
import {StyleSheet} from '@atb/theme';

type TripMessagesProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
  messageStyle?: ViewStyle;
};
const TripMessages: React.FC<TripMessagesProps> = ({tripPattern, error}) => {
  const {t} = useTranslation();
  const {modesWeSellTicketsFor} = useFirestoreConfiguration();
  const someTicketsAreUnavailableInApp = hasLegsWeCantSellTicketsFor(
    tripPattern,
    modesWeSellTicketsFor,
  );
  const styles = useStyles();
  const canUseCollabTicket = someLegsAreByTrain(tripPattern);
  const shortWaitTime = hasShortWaitTime(tripPattern.legs);
  const {enable_ticketing} = useRemoteConfig();
  const isTicketingEnabledAndSomeTicketsAreUnavailableInApp =
    enable_ticketing && someTicketsAreUnavailableInApp;
  const tripIncludesRailReplacementBus = tripPattern.legs.some(
    (leg) => leg.transportSubmode === TransportSubmode.RailReplacementBus,
  );

  return (
    <>
      {tripIncludesRailReplacementBus && (
        <MessageBox
          containerStyle={styles.messageBox}
          type="warning"
          message={t(TripDetailsTexts.messages.tripIncludesRailReplacementBus)}
        />
      )}
      {shortWaitTime && (
        <MessageBox
          containerStyle={styles.messageBox}
          type="info"
          message={t(TripDetailsTexts.messages.shortTime)}
        />
      )}
      {isTicketingEnabledAndSomeTicketsAreUnavailableInApp && (
        <MessageBox
          containerStyle={styles.messageBox}
          type="info"
          message={t(TripDetailsTexts.messages.ticketsWeDontSell)}
        />
      )}
      {canUseCollabTicket && (
        <MessageBox
          containerStyle={styles.messageBox}
          type="info"
          message={t(TripDetailsTexts.messages.collabTicketInfo)}
        />
      )}
      {error && (
        <>
          <ScreenReaderAnnouncement message={translatedError(error, t)} />
          <MessageBox
            containerStyle={styles.messageBox}
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
export default TripMessages;

function someLegsAreByTrain(tripPattern: TripPattern): boolean {
  return tripPattern.legs.some((leg) => leg.mode === Mode.Rail);
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
}));
