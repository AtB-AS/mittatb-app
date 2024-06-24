import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  PaymentCreditCardTexts,
  useTranslation,
} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useAnalytics} from '@atb/analytics';
import {useReserveOfferMutation} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/use-reserve-offer-mutation';
import {useCancelPaymentMutation} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/use-cancel-payment-mutation';
import {WebViewTerminal} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/WebViewTerminal';
import {usePurchaseCallbackListener} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/use-purchase-callback-listener';
import {LoadingOverlay} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/LoadingOverlay';
import {PaymentProcessorStatus} from '@atb/stacks-hierarchy/types';
import {PaymentType, useTicketingState} from '@atb/ticketing';
import {useOpenVippsAfterReservation} from '@atb/stacks-hierarchy/Root_PurchasePaymentScreen/use-open-vipps-after-reservation';

type Props = RootStackScreenProps<'Root_PurchasePaymentScreen'>;

export const Root_PurchasePaymentScreen = ({route, navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {offers, destinationAccountId, paymentMethod} = route.params;
  const analytics = useAnalytics();
  const {fareContracts, sentFareContracts} = useTicketingState();
  const [paymentProcessorStatus, setPaymentProcessorStatus] =
    useState<PaymentProcessorStatus>('loading');

  const navigateToActiveTicketsScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', {
      screen: 'TabNav_TicketingStack',
      params: {
        screen: 'Ticketing_RootScreen',
        params: {screen: 'TicketTabNav_ActiveFareProductsTabScreen'},
      },
    });
  }, [navigation]);

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

  useEffect(() => {
  }, [reserveMutation.data]);

  useEffect(() => {
    const orderId = reserveMutation.data?.order_id;
    if (orderId) {
      const fareContract = [...(fareContracts ?? []), ...(sentFareContracts ?? [])].map((fc) => {
        return {
          orderId: fc.orderId,
        };
      }).find((contract) => contract.orderId === orderId);
      if (fareContract) {
        navigateToActiveTicketsScreen();
      }
    }
  }, [fareContracts, sentFareContracts, reserveMutation.data, navigateToActiveTicketsScreen]);

  const reserveOffer = reserveMutation.mutate;
  useEffect(() => {
    reserveOffer();
  }, [reserveOffer]);

  const restart = async () => {
    setPaymentProcessorStatus('loading');
    if (reserveMutation.isSuccess) {
      await cancelPaymentMutation.mutateAsync(reserveMutation.data);
    }
    reserveOffer();
  };

  const isLoading =
    reserveMutation.isLoading ||
    (reserveMutation.isSuccess && paymentProcessorStatus === 'loading');

  const isError = reserveMutation.isError || paymentProcessorStatus === 'error';

  useOpenVippsAfterReservation(
    reserveMutation.data?.url,
    paymentMethod.paymentType,
    useCallback(() => setPaymentProcessorStatus('error'), []),
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
            navigation.pop();
          },
        }}
      />

      <View style={{flex: 1}}>
        {isLoading && (
          <LoadingOverlay text={t(PaymentCreditCardTexts.loading)} />
        )}

        {reserveMutation.isSuccess &&
          paymentMethod.paymentType !== PaymentType.Vipps &&
          paymentProcessorStatus !== 'error' && (
            <WebViewTerminal
              offerReservation={reserveMutation.data}
              onWebViewStatusChange={setPaymentProcessorStatus}
            />
          )}

        {isError && (
          <View style={styles.center}>
            <MessageInfoBox
              message={
                t(PaymentCreditCardTexts.error) +
                (reserveMutation.isSuccess
                  ? t(PaymentCreditCardTexts.vippsInstalledError)
                  : '')
              }
              type="error"
              style={styles.messageBox}
              onPressConfig={{
                action: restart,
                text: t(dictionary.retry),
              }}
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
