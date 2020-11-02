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
import {capturePayment} from '../../../../../api';
import {
  PaymentFailedReason,
  useTicketState,
} from '../../../../../TicketContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from '../../../../../theme';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentCreditCard'>;
  route: RouteProp<TicketingStackParams, 'PaymentCreditCard'>;
};

enum NetsPaymentStatus {
  UserCancelled = 'Cancel',
  Succeeded = 'OK',
}

const CreditCard: React.FC<Props> = ({route, navigation}) => {
  const styles = useStyles();
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
        case NetsPaymentStatus.Succeeded:
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
        case NetsPaymentStatus.UserCancelled:
          paymentFailedForReason(PaymentFailedReason.UserCancelled);
          navigation.popToTop();
          break;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={{opacity: isLoading ? 0 : 1}}
        source={{
          uri: url,
        }}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
      />
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.modal_Level2,
  },
}));

export default CreditCard;
