import {getAxiosErrorType} from '@atb/api/utils';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import MessageBox from '@atb/components/message-box';
import {
  TranslatedString,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {AxiosError} from 'axios';
import React from 'react';
import {ViewStyle} from 'react-native';

type TripMessagesProps = {
  shortTime: boolean;
  error?: AxiosError;
  messageStyle?: ViewStyle;
};
const TripMessages: React.FC<TripMessagesProps> = ({
  error,
  shortTime,
  messageStyle,
}) => {
  const {t} = useTranslation();
  return (
    <>
      {shortTime && (
        <MessageBox
          containerStyle={messageStyle}
          type="info"
          message="Vær oppmerksom på kort byttetid."
        />
      )}
      {error && (
        <>
          <ScreenReaderAnnouncement message={t(translatedError(error))} />
          <MessageBox
            containerStyle={messageStyle}
            type="warning"
            message={t(translatedError(error))}
          />
        </>
      )}
    </>
  );
};
function translatedError(error: AxiosError): TranslatedString {
  const errorType = getAxiosErrorType(error);
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return TripDetailsTexts.messages.errorNetwork;
    default:
      return TripDetailsTexts.messages.errorDefault;
  }
}
export default TripMessages;
