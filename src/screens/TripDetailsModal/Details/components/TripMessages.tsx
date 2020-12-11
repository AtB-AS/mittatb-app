import {AxiosError} from 'axios';
import React from 'react';
import {ViewStyle} from 'react-native';
import {getAxiosErrorType} from '../../../../api/utils';
import MessageBox from '../../../../message-box';
import {useStyle} from '../../../../theme';

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
        <MessageBox
          containerStyle={messageStyle}
          type="warning"
          message={translateError(error)}
        />
      )}
    </>
  );
};
function translateError(error: AxiosError): string {
  const errorType = getAxiosErrorType(error);
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return 'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil.';
    default:
      return 'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?';
  }
}
export default TripMessages;
