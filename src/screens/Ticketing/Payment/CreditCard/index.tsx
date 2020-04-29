import React, {useState} from 'react';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {parse as parseURL} from 'search-params';
import {TicketingStackParams} from '../..';
import {
  WebViewNavigationEvent,
  WebViewErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {capturePayment} from '../../../../api';

function log(event: WebViewNavigationEvent | WebViewErrorEvent) {
  const {nativeEvent} = event;
  console.log(nativeEvent);
}

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentCreditCard'>;
  route: RouteProp<TicketingStackParams, 'PaymentCreditCard'>;
};

const CreditCard: React.FC<Props> = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {url, transaction_id} = route.params;

  const onLoadEnd = () => {
    if (isLoading) {
      setIsLoading(false);
    }
  };

  const onLoadStart = async (
    event: WebViewNavigationEvent | WebViewErrorEvent,
  ) => {
    const {
      nativeEvent: {url},
    } = event;
    if (url.includes('/paymentredirect')) {
      const params = parseURL(url);
      const responseCode = params['responseCode'];
      if (responseCode === 'OK') {
        await capturePayment(transaction_id);
        navigation.reset({
          routes: [{name: 'Tickets', params: {hasPurchased: true}}],
        });
      }
    }
  };
  // /ticket/v1/paymentredirect?transactionid=transactionId&responseCode=OK
  return (
    <WebView
      style={{opacity: isLoading ? 0 : 1}}
      source={{
        uri: url.startsWith('http') ? url : 'http://127.0.0.1:8080' + url,
      }}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
    />
  );
};

export default CreditCard;
