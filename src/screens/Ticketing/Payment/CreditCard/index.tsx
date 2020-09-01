import React, {useState, useRef} from 'react';
import WebView from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {parse as parseURL} from 'search-params';
import {TicketingStackParams} from '../..';
import {
  WebViewNavigationEvent,
  WebViewErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {capturePayment} from '../../../../api';
import {useTicketState, PaymentFailedReason} from '../../TicketContext';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentCreditCard'>;
  route: RouteProp<TicketingStackParams, 'PaymentCreditCard'>;
};

const CreditCard: React.FC<Props> = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    paymentFailedForReason,
    activatePollingForNewTickets,
  } = useTicketState();
  const {url, transaction_id, payment_id} = route.params;
  const isCaptureInProgressRef = useRef(false);

  const onLoadEnd = ({
    nativeEvent: {url},
  }: WebViewNavigationEvent | WebViewErrorEvent) => {
    if (isLoading && !url.includes('/EnturPaymentRedirect')) {
      setIsLoading(false);
    }
  };

  const onLoadStart = async ({
    nativeEvent: {url},
  }: WebViewNavigationEvent | WebViewErrorEvent) => {
    if (url.includes('/EnturPaymentRedirect')) {
      setIsLoading(true);
      const params = parseURL(url);
      const responseCode = params['responseCode'];
      switch (responseCode) {
        case 'OK':
          if (isCaptureInProgressRef.current) return;
          try {
            isCaptureInProgressRef.current = true;
            await capturePayment(payment_id, transaction_id);
            activatePollingForNewTickets();
          } catch (error) {
            paymentFailedForReason(PaymentFailedReason.CaptureFailed);
          } finally {
            isCaptureInProgressRef.current = false;
            navigation.popToTop();
          }
          break;
        case 'Cancel':
          paymentFailedForReason(PaymentFailedReason.Cancelled);
          navigation.popToTop();
          break;
      }
    }
  };

  return (
    <WebView
      style={{opacity: isLoading ? 0 : 1}}
      source={{
        uri: url,
      }}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
    />
  );
};

export default CreditCard;
