import {TripPattern} from '@atb/api/types/trips';
import {getAxiosErrorType} from '@atb/api/utils';
import {MessageBox} from '@atb/components/message-box';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {hasLegsWeCantSellTicketsFor} from '@atb/operator-config';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet} from '@atb/theme';
import {
  DetailsMessages,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {
  canSellCollabTicket,
  hasShortWaitTime,
  hasShortWaitTimeAndNotGuaranteedCorrespondence,
} from '@atb/travel-details-screens/utils';
import {TransportSubmode} from '@entur/sdk/lib/journeyPlanner/types';
import {AxiosError} from 'axios';
import React from 'react';

type TripMessagesProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
};
export const TripMessages: React.FC<TripMessagesProps> = ({
  tripPattern,
  error,
}) => {
  const {t} = useTranslation();
  const {modesWeSellTicketsFor} = useFirestoreConfiguration();
  const someTicketsAreUnavailableInApp = hasLegsWeCantSellTicketsFor(
    tripPattern,
    modesWeSellTicketsFor,
  );
  const styles = useStyles();
  const canSellCollab = canSellCollabTicket(tripPattern);
  const shortWaitTime = hasShortWaitTime(tripPattern.legs);
  const shortWaitTimeAndNotGuaranteedCorrespondence =
    hasShortWaitTimeAndNotGuaranteedCorrespondence(tripPattern.legs);

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
          style={styles.messageBox}
          type="warning"
          message={t(TripDetailsTexts.messages.tripIncludesRailReplacementBus)}
        />
      )}
      {shortWaitTime && (
        <MessageBox
          style={styles.messageBox}
          type="info"
          message={[
            t(TripDetailsTexts.messages.shortTime),
            shortWaitTimeAndNotGuaranteedCorrespondence
              ? t(TripDetailsTexts.messages.correspondenceNotGuaranteed)
              : '',
          ].join(' ')}
        />
      )}
      {isTicketingEnabledAndSomeTicketsAreUnavailableInApp && (
        <MessageBox
          style={styles.messageBox}
          type="info"
          message={
            canSellCollab
              ? t(DetailsMessages.messages.collabTicketInfo)
              : t(DetailsMessages.messages.ticketsWeDontSell)
          }
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
}));
