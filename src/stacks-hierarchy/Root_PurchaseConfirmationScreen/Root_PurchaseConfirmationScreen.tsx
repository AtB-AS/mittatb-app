import {useAnalyticsContext} from '@atb/analytics';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useOtherDeviceIsInspectableWarning} from '@atb/modules/fare-contracts';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {PaymentType, ReserveOffer} from '@atb/ticketing';
import {
  PurchaseConfirmationTexts,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {addMinutes} from 'date-fns';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useOfferState} from '../Root_PurchaseOverviewScreen/use-offer-state';
import {
  saveLastUsedRecurringPaymentOrType,
  usePreviousPaymentMethods,
} from '../saved-payment-utils';
import {PaymentMethod} from '../types';
import {PreassignedFareContractSummary} from './components/PreassignedFareProductSummary';
import {SelectPaymentMethodSheet} from './components/SelectPaymentMethodSheet';
import {PriceSummary} from './components/PriceSummary';
import {useReserveOfferMutation} from './use-reserve-offer-mutation';
import {useCancelPaymentMutation} from './use-cancel-payment-mutation';
import {useOpenVippsAfterReservation} from './use-open-vipps-after-reservation';
import {useOnFareContractReceived} from './use-on-fare-contract-received';
import {usePurchaseCallbackListener} from './use-purchase-callback-listener';
import {closeInAppBrowseriOS} from '@atb/in-app-browser';
import {openInAppBrowser} from '@atb/in-app-browser/in-app-browser';
import {APP_SCHEME} from '@env';
import {useAuthContext} from '@atb/auth';
import {Section} from '@atb/components/sections';
import {formatNumberToString} from '@atb/utils/numbers';
import {PaymentSelectionSectionItem} from './components/PaymentSelectionSectionItem';

type Props = RootStackScreenProps<'Root_PurchaseConfirmationScreen'>;

export const Root_PurchaseConfirmationScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const {userId} = useAuthContext();

  const interactiveColor = theme.color.interactive[0];
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

  const isOnBehalfOf = !!recipient;

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
  } = useOfferState(
    selection,
    preassignedFareProductAlternatives,
    isOnBehalfOf,
  );

  const offers: ReserveOffer[] = userProfilesWithCountAndOffer.map(
    ({count, offer: {offer_id}}) => ({
      count,
      offer_id,
    }),
  );
  const totalPriceString = formatNumberToString(totalPrice, language);

  const reserveMutation = useReserveOfferMutation({
    offers,
    paymentMethod,
    recipient,
    shouldSavePaymentMethod,
  });
  const cancelPaymentMutation = useCancelPaymentMutation();

  useOpenVippsAfterReservation(
    reserveMutation.data?.url,
    paymentMethod?.paymentType,
    useCallback(() => setVippsNotInstalledError(true), []),
  );

  const onPaymentCompleted = useCallback(async () => {
    saveLastUsedRecurringPaymentOrType(
      userId,
      paymentMethod?.paymentType,
      reserveMutation.data?.recurring_payment_id,
    );
    closeInAppBrowseriOS();
    navigation.navigate('Root_TabNavigatorStack', {
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
    reserveMutation.data?.recurring_payment_id,
  ]);

  useEffect(() => {
    if (
      reserveMutation.isSuccess &&
      paymentMethod?.paymentType !== PaymentType.Vipps &&
      reserveMutation.data.url
    ) {
      openInAppBrowser(
        reserveMutation.data.url,
        'cancel',
        `${APP_SCHEME}://purchase-callback`,
        onPaymentCompleted,
      );
    }
  }, [
    reserveMutation.isSuccess,
    reserveMutation.data?.url,
    paymentMethod?.paymentType,
    onPaymentCompleted,
  ]);

  // When deep link {APP_SCHEME}://purchase-callback is called, save payment
  // method and navigate to active tickets.
  usePurchaseCallbackListener(onPaymentCompleted);

  // In edge cases where the fare contract appears before the callback is
  // called, we can cancel the payment flow and navigate to active tickets.
  useOnFareContractReceived({
    orderId: reserveMutation.data?.order_id,
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
            reserveMutation.reset();
            setVippsNotInstalledError(false);
            if (reserveMutation.isSuccess) {
              cancelPaymentMutation.mutate(reserveMutation.data);
              analytics.logEvent('Ticketing', 'Payment cancelled');
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
    <View style={styles.container}>
      <FullScreenHeader
        title={t(PurchaseConfirmationTexts.title)}
        leftButton={{
          type: 'back',
          onPress: () => {
            if (reserveMutation.isSuccess) {
              cancelPaymentMutation.mutate(reserveMutation.data);
              analytics.logEvent('Ticketing', 'Payment cancelled');
            }
            navigation.pop();
          },
        }}
        globalMessageContext={GlobalMessageContextEnum.appTicketing}
      />
      <ScrollView style={styles.infoSection}>
        {offerError && (
          <MessageInfoBox
            type="error"
            title={t(PurchaseConfirmationTexts.errorMessageBox.title)}
            message={t(PurchaseConfirmationTexts.errorMessageBox.message)}
            onPressConfig={{
              action: refreshOffer,
              text: t(dictionary.retry),
            }}
            style={styles.errorMessage}
          />
        )}
        <PreassignedFareContractSummary
          fareProductTypeConfig={selection.fareProductTypeConfig}
          fromPlace={selection.zones?.from || selection.stopPlaces?.from}
          toPlace={selection.zones?.to || selection.stopPlaces?.to}
          isSearchingOffer={isSearchingOffer}
          preassignedFareProduct={selection.preassignedFareProduct}
          recipient={recipient}
          travelDate={selection.travelDate}
          validDurationSeconds={validDurationSeconds}
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
            style={styles.warningMessage}
            isMarkdown={true}
          />
        )}
        <GlobalMessage
          style={styles.purchaseInformation}
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
            style={{marginBottom: theme.spacing.medium}}
            message={t(PurchaseConfirmationTexts.reserveError)}
            type="error"
          />
        )}
        {vippsNotInstalledError && (
          <MessageInfoBox
            style={{marginBottom: theme.spacing.medium}}
            message={t(PurchaseConfirmationTexts.vippsInstalledError)}
            type="error"
          />
        )}
        {paymentMethod && (
          <Section>
            <PaymentSelectionSectionItem
              paymentMethod={paymentMethod}
              onPress={selectPaymentMethod}
            />
          </Section>
        )}
        {isSearchingOffer ? (
          <ActivityIndicator
            size="large"
            color={theme.color.foreground.dynamic.primary}
            style={{margin: theme.spacing.medium}}
          />
        ) : (
          <View>
            {paymentMethod ? (
              <View style={styles.flexColumn}>
                <Button
                  expanded={true}
                  text={t(
                    PurchaseConfirmationTexts.payTotal.text(totalPriceString),
                  )}
                  interactiveColor={interactiveColor}
                  disabled={!!offerError}
                  onPress={() => {
                    analytics.logEvent(
                      'Ticketing',
                      'Pay with previous payment method clicked',
                      {
                        paymentMethod: paymentMethod?.paymentType,
                        mode: params.mode,
                      },
                    );
                    goToPayment();
                  }}
                  loading={reserveMutation.isLoading}
                />
              </View>
            ) : (
              <Button
                expanded={true}
                interactiveColor={interactiveColor}
                text={t(PurchaseConfirmationTexts.choosePaymentMethod.text)}
                disabled={!!offerError}
                accessibilityHint={t(
                  PurchaseConfirmationTexts.choosePaymentMethod.a11yHint,
                )}
                onPress={() => {
                  analytics.logEvent('Ticketing', 'Confirm purchase clicked', {
                    mode: params.mode,
                  });
                  selectPaymentMethod();
                }}
                testID="choosePaymentMethodButton"
                ref={onCloseFocusRef}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  flexColumn: {
    flex: 1,
    marginVertical: theme.spacing.medium,
  },
  errorMessage: {
    marginBottom: theme.spacing.medium,
  },
  warningMessage: {
    marginBottom: theme.spacing.medium,
  },
  infoSection: {padding: theme.spacing.medium},
  purchaseInformation: {
    marginBottom: theme.spacing.medium,
  },
}));
