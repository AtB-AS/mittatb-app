import React, {useState, useRef, useCallback, useEffect} from 'react';
import WebView from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {parse as parseURL} from 'search-params';
import {TicketingStackParams} from '../..';
import {
  WebViewNavigationEvent,
  WebViewErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {capturePayment, reserveOffers} from '../../../../../api';
import {
  PaymentFailedReason,
  useTicketState,
} from '../../../../../TicketContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from '../../../../../theme';
import {TicketReservation} from '../../../../../api/fareContracts';
import {ActivityIndicator, View} from 'react-native';
import {ArrowLeft} from '../../../../../assets/svg/icons/navigation';
import Header from '../../../../../ScreenHeader';
import {DismissableStackNavigationProp} from '../../../../../navigation/createDismissableStackNavigator';

type Props = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'PaymentCreditCard'
  >;
  route: RouteProp<TicketingStackParams, 'PaymentCreditCard'>;
};

enum NetsPaymentStatus {
  UserCancelled = 'Cancel',
  Succeeded = 'OK',
}

const CreditCard: React.FC<Props> = ({route, navigation}) => {
  const {offer_id, count} = route.params;
  const [reservation, setReservation] = useState<TicketReservation | undefined>(
    undefined,
  );

  useEffect(() => {
    async function reserveOffer() {
      try {
        const response = await reserveOffers(
          [{offer_id, count}],
          'creditcard',
          {
            retry: true,
          },
        );
        setReservation(response);
      } catch (err) {
        console.warn(err);
      }
    }

    reserveOffer();
  }, [offer_id, count]);

  const cancel = () => navigation.goBack();
  const dismiss = () => navigation.dismiss();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        title="Betaling"
        leftButton={{
          icon: <ArrowLeft />,
          onPress: cancel,
          accessibilityLabel:
            'Avslutt betaling og gå tilbake til valg av reisende',
        }}
      />
      <ActivityIndicator
        style={{position: 'absolute', top: '50%', left: '50%'}}
      />
      <View style={{flex: 1}}>
        {reservation && (
          <PaymentTerminal
            reservation={reservation}
            cancel={cancel}
            finish={dismiss}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const PaymentTerminal: React.FC<{
  reservation: TicketReservation;
  cancel: () => void;
  finish: () => void;
}> = ({reservation, cancel, finish}) => {
  const {url, payment_id, transaction_id} = reservation;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    paymentFailedForReason,
    activatePollingForNewTickets,
  } = useTicketState();
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
            finish();
          }
          break;
        case NetsPaymentStatus.UserCancelled:
          paymentFailedForReason(PaymentFailedReason.UserCancelled);
          cancel();
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.modal_Level2,
  },
}));

export default CreditCard;
