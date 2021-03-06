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

type TripMessagesProps = {
  shortTime: boolean;
  noTicketsAvailable: boolean;
  error?: AxiosError;
  messageStyle?: ViewStyle;
};
const TripMessages: React.FC<TripMessagesProps> = ({
  error,
  shortTime,
  noTicketsAvailable,
  messageStyle,
}) => {
  const {t} = useTranslation();
  return (
    <>
      {shortTime && (
        <MessageBox
          containerStyle={messageStyle}
          type="info"
          message={t(TripDetailsTexts.messages.shortTime)}
        />
      )}
      {noTicketsAvailable && (
        <MessageBox
          containerStyle={messageStyle}
          type="warning"
          message={t(TripDetailsTexts.messages.ticketsWeDontSell)}
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
