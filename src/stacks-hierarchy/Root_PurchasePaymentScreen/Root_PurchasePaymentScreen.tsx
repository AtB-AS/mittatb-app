import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {PaymentCreditCardTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useAnalytics} from '@atb/analytics';
import {useReserveOfferMutation} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/use-reserve-offer-mutation';
import {useCancelPaymentMutation} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/use-cancel-payment-mutation';
import {WebViewTerminal} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/WebViewTerminal';
import {usePurchaseCallbackListener} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/use-purchase-callback-listener';
import {LoadingOverlay} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/LoadingOverlay';
import {WebViewStatus} from '@atb/stacks-hierarchy/types';
import {PaymentType} from '@atb/ticketing';
import {useOpenVippsAfterReservation} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/use-open-vipps-after-reservation';

type Props = RootStackScreenProps<'Root_PurchasePaymentScreen'>;

export const Root_PurchasePaymentScreen = ({route, navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {offers, destinationAccountId, paymentMethod} = route.params;
  const analytics = useAnalytics();
  const [webViewStatus, setWebViewStatus] = useState<WebViewStatus>('loading');

  const navigateToActiveTicketsScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', {
      screen: 'TabNav_TicketingStack',
      params: {
        screen: 'Ticketing_RootScreen',
        params: {screen: 'TicketTabNav_ActiveFareProductsTabScreen'},
      },
    });
  }, [navigation]);

  const navigateBackFromTerminal = () => {
    analytics.logEvent('Ticketing', 'Payment cancelled', {
      paymentMethod: route.params.paymentMethod,
    });
    navigation.pop();
  };

  const reserveMutation = useReserveOfferMutation({
    offers,
    paymentMethod,
    destinationAccountId,
  });
  const cancelPaymentMutation = useCancelPaymentMutation();
  usePurchaseCallbackListener(
    navigateToActiveTicketsScreen,
    paymentMethod,
    reserveMutation.data?.recurring_payment_id,
  );

  const reserveOffer = reserveMutation.mutate;
  useEffect(() => {
    reserveOffer();
  }, [reserveOffer]);

  const restart = () => {
    setWebViewStatus('loading');
    reserveOffer();
  };

  const isLoading =
    reserveMutation.isLoading ||
    (reserveMutation.isSuccess && webViewStatus === 'loading');

  const isError = reserveMutation.isError || webViewStatus === 'error';

  useOpenVippsAfterReservation(
    reserveMutation.data?.url,
    paymentMethod.paymentType,
    useCallback(() => setWebViewStatus('error'), []),
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(PaymentCreditCardTexts.header.title)}
        leftButton={{
          type: 'cancel',
          onPress: async () => {
            if (reserveMutation.isSuccess) {
              cancelPaymentMutation.mutate(reserveMutation.data);
            }
            analytics.logEvent('Ticketing', 'Payment cancelled');
            navigateBackFromTerminal();
          },
        }}
      />

      <View style={{flex: 1}}>
        {isLoading && (
          <LoadingOverlay text={t(PaymentCreditCardTexts.loading)} />
        )}

        {reserveMutation.isSuccess &&
          paymentMethod.paymentType !== PaymentType.Vipps &&
          webViewStatus !== 'error' && (
            <WebViewTerminal
              offerReservation={reserveMutation.data}
              onWebViewStatusChange={setWebViewStatus}
            />
          )}

        {isError && (
          <View style={styles.center}>
            <MessageInfoBox
              message={t(PaymentCreditCardTexts.error)}
              type="error"
              style={styles.messageBox}
            />
            <Button
              onPress={restart}
              text={t(PaymentCreditCardTexts.buttons.restart)}
              style={styles.button}
            />
            <Button
              interactiveColor="interactive_1"
              onPress={() => navigateBackFromTerminal()}
              text={t(PaymentCreditCardTexts.buttons.goBack)}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));
