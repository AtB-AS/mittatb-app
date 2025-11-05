import {useAnalyticsContext} from '@atb/modules/analytics';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenView} from '@atb/components/screen-view';
import {
  getReservationStatus,
  useOtherDeviceIsInspectableWarning,
} from '@atb/modules/fare-contracts';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  ReserveOfferResponse,
  PaymentType,
  ReserveOffer,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {
  PurchaseConfirmationTexts,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {addMinutes} from 'date-fns';
import React, {RefObject, useCallback, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useOfferState} from '../Root_PurchaseOverviewScreen/use-offer-state';
import {
  savePreviousPayment,
  usePreviousPaymentMethods,
} from '@atb/modules/payment';
import {PaymentMethod} from '@atb/modules/payment';
import {PreassignedFareContractSummary} from './components/PreassignedFareProductSummary';
import {SelectPaymentMethodSheet} from '@atb/modules/payment';
import {PriceSummary} from './components/PriceSummary';
import {useReserveOfferMutation} from './use-reserve-offer-mutation';
import {useCancelPaymentMutation} from './use-cancel-payment-mutation';
import {useOpenVippsAfterReservation} from './use-open-vipps-after-reservation';
import {useOnFareContractReceived} from './use-on-fare-contract-received';
import {usePurchaseCallbackListener} from './use-purchase-callback-listener';
import {
  closeInAppBrowseriOS,
  openInAppBrowser,
} from '@atb/modules/in-app-browser';
import {APP_SCHEME} from '@env';
import {useAuthContext} from '@atb/modules/auth';
import {Section} from '@atb/components/sections';
import SvgClose from '@atb/assets/svg/mono-icons/actions/Close';
import {ThemeText} from '@atb/components/text';
import {MutationStatus} from '@tanstack/react-query';
import {PaymentSelectionSectionItem} from '@atb/modules/payment';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {formatNumberToString} from '@atb-as/utils';

type Props = RootStackScreenProps<'Root_PurchaseConfirmationScreen'>;

export const Root_PurchaseConfirmationScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {userId} = useAuthContext();

  const {open: openBottomSheet, close: closeBottomSheet} =
    useBottomSheetContext();
  const {previousPaymentMethod, recurringPaymentMethods} =
    usePreviousPaymentMethods();
  const analytics = useAnalyticsContext();

  const inspectableTokenWarningText = useOtherDeviceIsInspectableWarning();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>();
  const [shouldSavePaymentMethod, setShouldSavePaymentMethod] = useState(false);
  const paymentMethod = selectedPaymentMethod ?? previousPaymentMethod;
  const [vippsNotInstalledError, setVippsNotInstalledError] = useState(false);
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const {selection, recipient} = params;

  const preassignedFareProductAlternatives = useMemo(
    () => [selection.preassignedFareProduct],
    [selection.preassignedFareProduct],
  );

  const {
    offerSearchTime,
    isSearchingOffer,
    error: offerError,
    validDurationSeconds,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
  } = useOfferState(preassignedFareProductAlternatives, selection);

  const offers: ReserveOffer[] = userProfilesWithCountAndOffer.map(
    ({count, offer: {offerId}}) => ({
      count,
      offerId,
    }),
  );

  const reserveMutation = useReserveOfferMutation({
    offers,
    paymentMethod,
    recipient,
    shouldSavePaymentMethod,
  });
  useDoOnceWhen(
    () => {
      if (reserveMutation.status !== 'success') return;
      if (paymentMethod?.paymentType === PaymentType.Vipps) return;
      openInAppBrowser(
        reserveMutation.data.url,
        'cancel',
        `${APP_SCHEME}://purchase-callback`,
        onPaymentCompleted,
        () =>
          cancelPaymentMutation.mutate({
            reserveOfferResponse: reserveMutation.data,
            isUser: false,
          }),
      );
    },
    reserveMutation.status === 'success',
    false,
  );

  const cancelPaymentMutation = useCancelPaymentMutation({
    onSuccess: () => {
      cancelPaymentMutation.reset();
      reserveMutation.reset();
      analytics.logEvent('Ticketing', 'Payment cancelled');
    },
  });

  useOpenVippsAfterReservation(
    reserveMutation.data?.url,
    paymentMethod?.paymentType,
    useCallback(() => setVippsNotInstalledError(true), []),
  );

  const onPaymentCompleted = useCallback(async () => {
    savePreviousPayment(
      userId,
      paymentMethod?.paymentType,
      reserveMutation.data?.recurringPaymentId,
    );
    closeInAppBrowseriOS();
    navigation.popTo('Root_TabNavigatorStack', {
      screen: 'TabNav_TicketingStack',
      params: {
        screen: 'Ticketing_RootScreen',
        params: {screen: 'TicketTabNav_AvailableFareContractsTabScreen'},
      },
    });
  }, [
    navigation,
    userId,
    paymentMethod?.paymentType,
    reserveMutation.data?.recurringPaymentId,
  ]);

  // When deep link {APP_SCHEME}://purchase-callback is called, save payment
  // method and navigate to active tickets.
  usePurchaseCallbackListener(onPaymentCompleted);

  // In edge cases where the fare contract appears before the callback is
  // called, we can cancel the payment flow and navigate to active tickets.
  useOnFareContractReceived({
    orderId: reserveMutation.data?.orderId,
    callback: onPaymentCompleted,
  });

  function goToPayment() {
    setVippsNotInstalledError(false);
    const offerExpirationTime =
      offerSearchTime && addMinutes(offerSearchTime, 30).getTime();
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        analytics.logEvent('Ticketing', 'Pay with card selected', {
          paymentMethod,
        });
        reserveMutation.mutate();
      }
    }
  }

  async function selectPaymentMethod() {
    openBottomSheet(() => {
      return (
        <SelectPaymentMethodSheet
          recurringPaymentMethods={recurringPaymentMethods}
          onSelect={(
            paymentMethod: PaymentMethod,
            shouldSavePaymentMethod: boolean,
          ) => {
            setVippsNotInstalledError(false);
            if (reserveMutation.data) {
              cancelPaymentMutation.mutate({
                reserveOfferResponse: reserveMutation.data,
                isUser: false,
              });
            }
            setSelectedPaymentMethod(paymentMethod);
            setShouldSavePaymentMethod(shouldSavePaymentMethod);
            closeBottomSheet();
          }}
          currentOptions={{
            paymentMethod,
            shouldSavePaymentMethod,
          }}
        />
      );
    }, onCloseFocusRef);
  }

  return (
    <FullScreenView
      headerProps={{
        title: t(PurchaseConfirmationTexts.title),
        leftButton: {
          type: 'back',
          onPress: () => {
            if (reserveMutation.data) {
              cancelPaymentMutation.mutate({
                reserveOfferResponse: reserveMutation.data,
                isUser: false,
              });
            }
            navigation.pop();
          },
        },
        globalMessageContext: GlobalMessageContextEnum.appTicketing,
      }}
    >
      <View style={styles.container}>
        {offerError && (
          <MessageInfoBox
            type="error"
            title={t(PurchaseConfirmationTexts.errorMessageBox.title)}
            message={t(PurchaseConfirmationTexts.errorMessageBox.message)}
            onPressConfig={{
              action: refreshOffer,
              text: t(dictionary.retry),
            }}
          />
        )}
        <PreassignedFareContractSummary
          fareProductTypeConfig={selection.fareProductTypeConfig}
          fromPlace={selection.zones?.from || selection.stopPlaces?.from}
          toPlace={selection.zones?.to || selection.stopPlaces?.to}
          isSearchingOffer={isSearchingOffer}
          preassignedFareProduct={selection.preassignedFareProduct}
          recipient={recipient}
          travelDate={
            selection.legs.length // Is booking
              ? selection.legs[0].expectedStartTime
              : selection.travelDate
          }
          validDurationSeconds={validDurationSeconds}
          legs={selection.legs}
        />
        <PriceSummary
          fareProductTypeConfig={selection.fareProductTypeConfig}
          isSearchingOffer={isSearchingOffer}
          totalPrice={totalPrice}
          userProfilesWithCountAndOffer={userProfilesWithCountAndOffer}
        />
        {inspectableTokenWarningText && !recipient && (
          <MessageInfoBox
            type="warning"
            message={inspectableTokenWarningText}
            isMarkdown={true}
          />
        )}
        <GlobalMessage
          globalMessageContext={
            GlobalMessageContextEnum.appPurchaseConfirmationBottom
          }
          textColor="primary"
          ruleVariables={{
            preassignedFareProductType: selection.preassignedFareProduct.type,
          }}
        />
        {reserveMutation.isError && (
          <MessageInfoBox
            message={t(PurchaseConfirmationTexts.reserveError)}
            type="error"
          />
        )}
        {vippsNotInstalledError && (
          <MessageInfoBox
            message={t(PurchaseConfirmationTexts.vippsInstalledError)}
            type="error"
          />
        )}
        {paymentMethod && (
          <Section>
            <PaymentSelectionSectionItem
              paymentMethod={paymentMethod}
              onPress={selectPaymentMethod}
              ref={onCloseFocusRef}
            />
          </Section>
        )}
        {cancelPaymentMutation.status === 'error' && (
          <MessageInfoBox
            message={t(PurchaseConfirmationTexts.cancelPaymentError)}
            type="error"
          />
        )}
        <PaymentButton
          isSearchingOffer={isSearchingOffer}
          isOfferError={!!offerError}
          mode={params.mode}
          onCloseFocusRef={onCloseFocusRef}
          totalPrice={totalPrice}
          reserveOfferResponse={reserveMutation.data}
          reserveStatus={reserveMutation.status}
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={selectPaymentMethod}
          onGoToPayment={goToPayment}
          onCancelPayment={() => {
            if (reserveMutation.data) {
              cancelPaymentMutation.mutate({
                reserveOfferResponse: reserveMutation.data,
                isUser: true,
              });
            }
          }}
        />
      </View>
    </FullScreenView>
  );
};

type PaymentButtonProps = {
  isSearchingOffer: boolean;
  isOfferError: boolean;
  totalPrice: number;
  mode: 'TravelSearch' | 'Ticket' | undefined;
  onCloseFocusRef: RefObject<any>;
  reserveOfferResponse: ReserveOfferResponse | undefined;
  reserveStatus: MutationStatus;
  paymentMethod: PaymentMethod | undefined;
  onSelectPaymentMethod: () => void;
  onGoToPayment: () => void;
  onCancelPayment: () => void;
};
const PaymentButton = ({
  isSearchingOffer,
  isOfferError,
  totalPrice,
  mode,
  onCloseFocusRef,
  reserveOfferResponse,
  reserveStatus,
  paymentMethod,
  onSelectPaymentMethod,
  onGoToPayment,
  onCancelPayment,
}: PaymentButtonProps) => {
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const analytics = useAnalyticsContext();
  const styles = useStyles();
  const totalPriceString = formatNumberToString(totalPrice, language);

  const {reservations} = useTicketingContext();
  const reservation = reservations.find(
    (r) => r.orderId === reserveOfferResponse?.orderId,
  );
  const isReserving =
    !!reservation && getReservationStatus(reservation) === 'reserving';

  if (isSearchingOffer)
    return (
      <ActivityIndicator
        size="large"
        color={theme.color.foreground.dynamic.primary}
        style={{margin: theme.spacing.medium}}
      />
    );

  if (!paymentMethod)
    return (
      <Button
        expanded={true}
        interactiveColor={theme.color.interactive[0]}
        text={t(PurchaseConfirmationTexts.choosePaymentMethod.text)}
        disabled={!!isOfferError}
        accessibilityHint={t(
          PurchaseConfirmationTexts.choosePaymentMethod.a11yHint,
        )}
        onPress={() => {
          analytics.logEvent('Ticketing', 'Confirm purchase clicked', {
            mode: mode,
          });
          onSelectPaymentMethod();
        }}
        testID="choosePaymentMethodButton"
        ref={onCloseFocusRef}
      />
    );

  if (isReserving)
    return (
      <>
        <View style={styles.waitingForPayment}>
          <ThemeText>
            {t(PurchaseConfirmationTexts.waitingForPayment)}
          </ThemeText>
          <ActivityIndicator />
        </View>
        <Button
          expanded={true}
          text={t(PurchaseConfirmationTexts.cancelPayment)}
          mode="primary"
          rightIcon={{svg: SvgClose}}
          interactiveColor={theme.color.interactive.destructive}
          onPress={() => {
            onCancelPayment();
          }}
          accessibilityHint={t(
            PurchaseConfirmationTexts.changePaymentMethod.a11yHint,
          )}
        />
      </>
    );

  return (
    <Button
      expanded={true}
      text={t(PurchaseConfirmationTexts.payTotal.text(totalPriceString))}
      interactiveColor={theme.color.interactive[0]}
      disabled={!!isOfferError || reserveStatus === 'success'}
      onPress={() => {
        analytics.logEvent(
          'Ticketing',
          'Pay with previous payment method clicked',
          {
            paymentMethod: paymentMethod?.paymentType,
            mode: mode,
          },
        );
        onGoToPayment();
      }}
      loading={reserveStatus === 'pending'}
      testID="confirmPaymentButton"
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
  waitingForPayment: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.medium,
    marginVertical: theme.spacing.medium,
  },
}));
