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
import {Alert, ViewStyle} from 'react-native';
import {hasLegsWeCantSellTicketsFor} from '@atb/operator-config';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {secondsBetween} from '@atb/utils/date';
import {timeIsShort} from '@atb/screens/TripDetails/Details/utils';
import {iterateWithNext} from '@atb/utils/array';

type TripMessagesProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
  messageStyle?: ViewStyle;
};
const TripMessages: React.FC<TripMessagesProps> = ({
  tripPattern,
  error,
  messageStyle,
}) => {
  const {t} = useTranslation();
  const {modes_we_sell_tickets_for} = useRemoteConfig();
  const someTicketsAreUnavailableInApp = hasLegsWeCantSellTicketsFor(
    tripPattern,
    modes_we_sell_tickets_for,
  );
  const canUseCollabTicket = someLegsAreByTrain(tripPattern);
  const shortWaitTime = hasShortWaitTime(tripPattern.legs);

  return (
    <>
      {shortWaitTime && (
        <MessageBox
          containerStyle={messageStyle}
          type="info"
          message={t(TripDetailsTexts.messages.shortTime)}
        />
      )}
      {someTicketsAreUnavailableInApp && (
        <MessageBox
          containerStyle={messageStyle}
          type="warning"
          message={
            t(TripDetailsTexts.messages.ticketsWeDontSell) +
            (canUseCollabTicket
              ? `\n\n` + t(TripDetailsTexts.messages.collabTicketInfo)
              : ``)
          }
        />
      )}
      {error && (
        <>
          <ScreenReaderAnnouncement message={translatedError(error, t)} />
          <MessageBox
            containerStyle={messageStyle}
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
  const byTrain = tripPattern.legs.some((leg) => leg.mode === Mode.Rail);
  return byTrain;
}

function hasShortWaitTime(legs: Leg[]) {
  return iterateWithNext(legs)
    .map((pair) => {
      return secondsBetween(
        pair.current.expectedEndTime,
        pair.next.expectedStartTime,
      );
    })
    .filter((waitTime) => waitTime > 0)
    .some((waitTime) => timeIsShort(waitTime));
}
