import {useAnalyticsContext} from '@atb/modules/analytics';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenView} from '@atb/components/screen-view';
import {useOtherDeviceIsInspectableWarning} from '@atb/modules/fare-contracts';
import {GlobalMessage} from '@atb/modules/global-messages';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  ReserveOfferResponse,
  PaymentType,
  ReserveOffer,
  getLatestPaymentAgreement,
  useCancelPaymentMutation,
  useListPaymentAgreementsQuery,
} from '@atb/modules/ticketing';
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
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
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
import {useOnFareContractReceived} from './use-on-fare-contract-received';
import {usePurchaseCallbackListener} from './use-purchase-callback-listener';
import {
  closeInAppBrowseriOS,
  openInAppBrowser,
} from '@atb/modules/in-app-browser';
import {APP_SCHEME} from '@env';
import {useAuthContext} from '@atb/modules/auth';
import {Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {MutationStatus} from '@tanstack/react-query';
import {PaymentSelectionSectionItem} from '@atb/modules/payment';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {formatNumberToString} from '@atb-as/utils';
import {ScreenHeading} from '@atb/components/heading';
import {BottomSheetModalMethods} from '@atb/components/bottom-sheet';
import {useProductAlternatives} from '@atb/modules/ticketing';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {isNonRecurringPaymentType} from '@atb/modules/payment';
import {
  PayWithBonusPointsCheckbox,
  useRelevantTicketBonusProduct,
  useIsBonusActiveForUser,
} from '@atb/modules/bonus';
import {useParamAsState} from '@atb/utils/use-param-as-state';
import {startApplePayPayment} from './start-apple-pay';
import {Loading} from '@atb/components/loading';
import type {TripAnalytics} from '@atb/screen-components/travel-details-screens';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useStoredTripPatterns} from '@atb/modules/experimental-store-trip-patterns';
import {useIsExperimentalEnabled} from '@atb/modules/experimental';
import type {TripPattern} from '@atb/api/types/trips';
import {openUrl} from '@atb/utils/open-url';
import queryString from 'query-string';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {usePreventRemove} from '@react-navigation/native';

type Props = RootStackScreenProps<'Root_PurchaseConfirmationScreen'>;

export const Root_PurchaseConfirmationScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {userId} = useAuthContext();
  const [paymentData, setPaymentData] = useState<string>();

  const {previousPaymentMethod, recurringPaymentMethods} =
    usePreviousPaymentMethods();
  const analytics = useAnalyticsContext();

  const inspectableTokenWarningText = useOtherDeviceIsInspectableWarning();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>();
  const [shouldSavePaymentMethod, setShouldSavePaymentMethod] = useState(false);
  const paymentMethod = selectedPaymentMethod ?? previousPaymentMethod;
  const [vippsNotInstalledError, setVippsNotInstalledError] = useState(false);
  const [paymentNotCompletedError, setPaymentNotCompletedError] =
    useState(false);
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModalMethods | null>(null);
  const focusRef = useFocusOnLoad(navigation);

  const [selection] = useParamAsState(params.selection);
  const [bonusProductId, setBonusProductId] = useState<string | undefined>();
  const {recipient} = params;
  const productAlternatives = useProductAlternatives(selection);

  const {isSaveTripsEnabled, isVippsPaymentAgreementEnabled} =
    useFeatureTogglesContext();
  const isAutoSaveTripsEnabled = useIsExperimentalEnabled();
  const {addTripPattern, canAddTripPattern} = useStoredTripPatterns();
  // Several sources can end the same purchase, so only save the trip and
  // navigate once.
  const hasLeftScreenRef = useRef(false);

  const tripPatternToSave =
    isSaveTripsEnabled &&
    isAutoSaveTripsEnabled &&
    !recipient &&
    params.tripPattern &&
    canAddTripPattern(params.tripPattern)
      ? params.tripPattern
      : undefined;

  const {
    offerSearchTime,
    isSearchingOffer,
    error: offerError,
    validDurationSeconds,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
    supplementProductsWithCountAndOffer,
  } = useOfferState({
    preassignedFareProductAlternatives: productAlternatives,
    selection,
    bonusProductId,
  });

  const relevantTicketBonusProduct = useRelevantTicketBonusProduct(selection);
  const isBonusActiveForUser = useIsBonusActiveForUser();

  useEffect(() => {
    if (bonusProductId && bonusProductId !== relevantTicketBonusProduct?.id) {
      setBonusProductId(undefined);
    }
  }, [bonusProductId, relevantTicketBonusProduct?.id]);

  const isFree = totalPrice === 0;

  const userProfileOffers: ReserveOffer[] = userProfilesWithCountAndOffer.map(
    ({count, offer: {offerId}}) => ({
      count,
      offerId,
    }),
  );

  const baggageProductOffers: ReserveOffer[] =
    supplementProductsWithCountAndOffer.map(
      ({count, offer: {offerId, supplementProducts}}) => ({
        count,
        offerId,
        selectableProductIds: [supplementProducts[0].selectableId],
      }),
    );

  const offers: ReserveOffer[] = [
    ...userProfileOffers,
    ...baggageProductOffers,
  ];

  const shouldUsePaymentAgreement =
    isVippsPaymentAgreementEnabled &&
    paymentMethod?.paymentType === PaymentType.Vipps &&
    !isFree;
  const {data: paymentAgreements, isFetching: isFetchingPaymentAgreements} =
    useListPaymentAgreementsQuery(shouldUsePaymentAgreement);
  const paymentAgreementId = shouldUsePaymentAgreement
    ? getLatestPaymentAgreement(paymentAgreements, PaymentType.Vipps)?.id
    : undefined;

  const reserveMutation = useReserveOfferMutation({
    offers,
    paymentMethod: isFree ? undefined : paymentMethod,
    paymentAgreementId,
    recipient,
    shouldSavePaymentMethod,
    paymentData,
  });

  const isReservingRef = useRef(false);
  function reserve() {
    if (isReservingRef.current) return;
    isReservingRef.current = true;
    reserveMutation
      .mutateAsync()
      .catch(() => {})
      .finally(() => {
        isReservingRef.current = false;
      });
  }

  useDoOnceWhen(
    () => {
      if (reserveMutation.status !== 'success') return;
      const {url} = reserveMutation.data;
      if (paymentMethod?.paymentType === PaymentType.Vipps && url) {
        openVipps(reserveMutation.data, url);
        return;
      }
      if (
        !url ||
        (paymentMethod?.paymentType &&
          isNonRecurringPaymentType(paymentMethod.paymentType))
      ) {
        // For free and Apple Pay purchases, no futher action is needed here.
        onPaymentCompleted();
        return;
      }
      openInAppBrowser(url, {
        successUrl: `${APP_SCHEME}://purchase-callback`,
        onSuccess: onPurchaseCallback,
        onCancel: () => cancelPayment(reserveMutation.data, false),
        onError: () => {
          setPaymentNotCompletedError(true);
          cancelPayment(reserveMutation.data, false);
        },
      });
    },
    reserveMutation.status === 'success',
    false,
  );

  const cancelPaymentMutation = useCancelPaymentMutation({
    onSuccess: () => {
      cancelPaymentMutation.reset();
      reserveMutation.reset();
    },
  });

  function cancelPayment(
    reserveOfferResponse: ReserveOfferResponse,
    isUser: boolean,
  ) {
    closeInAppBrowseriOS();
    cancelPaymentMutation.mutate(
      {payment: reserveOfferResponse, isUser},
      {
        onError: () => {
          // If the cancel fails, the payment may have gone through
          navigateToTickets({refreshTickets: true});
        },
      },
    );
  }

  async function openVipps(
    reserveOfferResponse: ReserveOfferResponse,
    url: string,
  ) {
    let didFail = false;
    await openUrl(url, () => {
      didFail = true;
      setVippsNotInstalledError(true);
      cancelPayment(reserveOfferResponse, false);
    });
    if (!didFail) onPaymentCompleted();
  }

  const navigateToTickets = useCallback(
    (params: {savedTripPattern?: TripPattern; refreshTickets?: boolean}) => {
      if (hasLeftScreenRef.current) return;
      hasLeftScreenRef.current = true;
      closeInAppBrowseriOS();
      navigation.popTo('Root_TabNavigatorStack', {
        screen: 'TabNav_TicketingStack',
        params: {
          screen: 'Ticketing_RootScreen',
          params: {
            screen: 'TicketTabNav_AvailableFareContractsTabScreen',
            params,
          },
        },
      });
    },
    [navigation],
  );

  const onPaymentCompleted = useCallback(async () => {
    if (hasLeftScreenRef.current) return;
    savePreviousPayment(
      userId,
      paymentMethod?.paymentType,
      reserveMutation.data?.recurringPaymentId,
    );
    let savedTripPattern: TripPattern | undefined;
    if (tripPatternToSave) {
      addTripPattern(tripPatternToSave);
      savedTripPattern = tripPatternToSave;
      analytics.logEvent('Ticketing', 'Trip saved after purchase', {
        ...params.tripAnalytics,
      });
    }
    navigateToTickets({savedTripPattern});
  }, [
    navigateToTickets,
    userId,
    paymentMethod?.paymentType,
    reserveMutation.data?.recurringPaymentId,
    tripPatternToSave,
    params.tripAnalytics,
    addTripPattern,
    analytics,
  ]);

  // Call reserve when payment data is received from the Apple Pay payment sheet
  useDoOnceWhen(() => paymentData && reserve(), !!paymentData, false);

  // Apple Pay payment data is sent with reserve, so money may be withdrawn
  // when reserve fails with an unknown result.
  const isApplePayResultUnknown =
    paymentMethod?.paymentType === PaymentType.ApplePay &&
    reserveMutation.isError &&
    !['BAD_REQUEST', 'PROFILE_ERROR'].includes(reserveMutation.error.kind);
  useDoOnceWhen(
    () => navigateToTickets({refreshTickets: true}),
    isApplePayResultUnknown,
    false,
  );

  const resetReserveMutation = reserveMutation.reset;
  const onPurchaseCallback = useCallback(
    (url: string) => {
      const responseCode = queryString.parseUrl(url).query.response_code;
      if (responseCode && responseCode !== 'OK') {
        if (responseCode !== 'Cancel') setPaymentNotCompletedError(true);
        resetReserveMutation();
        return;
      }
      onPaymentCompleted();
    },
    [onPaymentCompleted, resetReserveMutation],
  );

  // When deep link {APP_SCHEME}://purchase-callback is called, handle it like
  // the in-app browser redirect.
  usePurchaseCallbackListener(onPurchaseCallback);

  // In edge cases where the fare contract appears before the callback is
  // called, we can cancel the payment flow and navigate to active tickets.
  useOnFareContractReceived({
    orderId: reserveMutation.data?.orderId,
    callback: onPaymentCompleted,
  });

  function goToPayment() {
    setVippsNotInstalledError(false);
    setPaymentNotCompletedError(false);
    const offerExpirationTime =
      offerSearchTime && addMinutes(offerSearchTime, 30).getTime();
    if (offerExpirationTime && offerExpirationTime < Date.now()) {
      refreshOffer();
      return;
    }
    if (totalPrice === 0) {
      analytics.logEvent('Ticketing', 'Complete free purchase selected');
      reserve();
      return;
    }

    if (paymentMethod?.paymentType === PaymentType.ApplePay) {
      setPaymentData(undefined);
      analytics.logEvent('Ticketing', 'Apple Pay selected', {
        paymentMethod: paymentMethod?.paymentType,
      });
      startApplePayPayment({
        userProfilesWithCountAndOffer,
        supplementProductsWithCountAndOffer,
        totalPrice,
        setPaymentData,
        language,
      });
    } else {
      analytics.logEvent('Ticketing', 'Pay with card selected', {
        paymentMethod: paymentMethod?.paymentType,
      });
      reserve();
    }
  }

  async function selectPaymentMethod() {
    bottomSheetModalRef.current?.present();
  }

  const isPaymentInProgress =
    cancelPaymentMutation.isPending ||
    reserveMutation.isPending ||
    reserveMutation.isSuccess;

  // Block the user from exiting the screen during reserve and cancel, including
  // iOS swipe and Android back actions.
  usePreventRemove(isPaymentInProgress, ({data}) => {
    // Navigation actions triggered while isPaymentInProgress is true will be
    // blocked. But if hasLeftScreenRef is set to true, this callback triggers
    // the navigation again, which isn't blocked by usePreventRemove.
    if (hasLeftScreenRef.current) navigation.dispatch(data.action);
  });

  if (isPaymentInProgress) {
    return (
      <View style={styles.paymentInProgressScreen}>
        <View style={styles.loading}>
          <Loading size="large" />
          <ThemeText>
            {t(PurchaseConfirmationTexts.paymentInProgress)}
          </ThemeText>
          <ScreenReaderAnnouncement
            message={t(PurchaseConfirmationTexts.paymentInProgress)}
          />
        </View>
        {reserveMutation.isSuccess &&
          (cancelPaymentMutation.isIdle ||
            cancelPaymentMutation.variables.isUser) && (
            <Button
              expanded={true}
              onPress={() => cancelPayment(reserveMutation.data, true)}
              text={t(PurchaseConfirmationTexts.cancelPayment)}
              mode="primary"
              surfaceColor="error"
              loading={cancelPaymentMutation.isPending}
            />
          )}
      </View>
    );
  }

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(PurchaseConfirmationTexts.title),
        leftButton: {type: 'back', onPress: () => navigation.pop()},
        globalMessageContext: GlobalMessageContextEnum.appTicketing,
      }}
      headerContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(PurchaseConfirmationTexts.title)}
        />
      )}
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
          preassignedFareProduct={selection.preassignedFareProduct}
          recipient={recipient}
          travelDate={
            selection.legs.length // Is booking
              ? selection.legs[0].expectedStartTime
              : selection.travelDate
          }
          validDurationSeconds={validDurationSeconds}
          legs={selection.legs}
          onEdit={
            params.allowEdit
              ? () => {
                  navigation.navigate('Root_PurchaseOverviewScreen', {
                    selection,
                    mode: params.mode,
                    tripAnalytics: params.tripAnalytics,
                    transitionOverride: 'slide-from-right',
                  });
                }
              : undefined
          }
        />
        <PriceSummary
          fareProductTypeConfig={selection.fareProductTypeConfig}
          isSearchingOffer={isSearchingOffer}
          totalPrice={totalPrice}
          userProfilesWithCountAndOffer={userProfilesWithCountAndOffer}
          supplementProductsWithCountAndOffer={
            supplementProductsWithCountAndOffer
          }
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
        {paymentNotCompletedError && (
          <MessageInfoBox
            message={t(PurchaseConfirmationTexts.paymentNotCompletedError)}
            type="error"
          />
        )}
        {vippsNotInstalledError && (
          <MessageInfoBox
            message={t(PurchaseConfirmationTexts.vippsInstalledError)}
            type="error"
          />
        )}
        {paymentMethod && totalPrice > 0 && (
          <Section>
            <PaymentSelectionSectionItem
              paymentMethod={paymentMethod}
              onPress={selectPaymentMethod}
              ref={onCloseFocusRef}
            />
          </Section>
        )}
        {!!relevantTicketBonusProduct && !isFree && isBonusActiveForUser && (
          <PayWithBonusPointsCheckbox
            bonusProduct={relevantTicketBonusProduct}
            isChecked={bonusProductId === relevantTicketBonusProduct.id}
            onPress={() =>
              setBonusProductId((prev) =>
                prev === relevantTicketBonusProduct.id
                  ? undefined
                  : relevantTicketBonusProduct.id,
              )
            }
          />
        )}
        <PaymentButton
          isSearchingOffer={isSearchingOffer}
          isOfferError={!!offerError}
          isFetchingPaymentAgreements={
            shouldUsePaymentAgreement && isFetchingPaymentAgreements
          }
          mode={params.mode}
          tripAnalytics={params.tripAnalytics}
          onCloseFocusRef={onCloseFocusRef}
          totalPrice={totalPrice}
          reserveStatus={reserveMutation.status}
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={selectPaymentMethod}
          onGoToPayment={goToPayment}
        />
      </View>

      <SelectPaymentMethodSheet
        recurringPaymentMethods={recurringPaymentMethods}
        onSelect={(
          paymentMethod: PaymentMethod,
          shouldSavePaymentMethod: boolean,
        ) => {
          setVippsNotInstalledError(false);
          setPaymentNotCompletedError(false);
          reserveMutation.reset();
          setSelectedPaymentMethod(paymentMethod);
          setShouldSavePaymentMethod(shouldSavePaymentMethod);
          bottomSheetModalRef.current?.dismiss();
        }}
        currentOptions={{
          paymentMethod,
          shouldSavePaymentMethod,
        }}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
      />
    </FullScreenView>
  );
};

type PaymentButtonProps = {
  isSearchingOffer: boolean;
  isOfferError: boolean;
  isFetchingPaymentAgreements: boolean;
  totalPrice: number;
  mode: 'TravelSearch' | 'Ticket' | undefined;
  tripAnalytics?: TripAnalytics;
  onCloseFocusRef: RefObject<any>;
  reserveStatus: MutationStatus;
  paymentMethod: PaymentMethod | undefined;
  onSelectPaymentMethod: () => void;
  onGoToPayment: () => void;
};
const PaymentButton = ({
  isSearchingOffer,
  isOfferError,
  isFetchingPaymentAgreements,
  totalPrice,
  mode,
  tripAnalytics,
  onCloseFocusRef,
  reserveStatus,
  paymentMethod,
  onSelectPaymentMethod,
  onGoToPayment,
}: PaymentButtonProps) => {
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const analytics = useAnalyticsContext();
  const totalPriceString = formatNumberToString(totalPrice, language);

  if (isSearchingOffer)
    return (
      <Loading
        size="large"
        style={{margin: theme.spacing.medium, alignSelf: 'center'}}
      />
    );

  if (!paymentMethod && totalPrice > 0)
    return (
      <Button
        surfaceColor="accent"
        expanded={true}
        text={t(PurchaseConfirmationTexts.choosePaymentMethod.text)}
        disabled={!!isOfferError}
        accessibilityHint={t(
          PurchaseConfirmationTexts.choosePaymentMethod.a11yHint,
        )}
        onPress={() => {
          analytics.logEvent('Ticketing', 'Choose payment method clicked', {
            mode: mode,
            ...tripAnalytics,
          });
          onSelectPaymentMethod();
        }}
        testID="choosePaymentMethodButton"
        ref={onCloseFocusRef}
      />
    );

  return (
    <Button
      surfaceColor="accent"
      expanded={true}
      text={
        totalPrice > 0
          ? t(PurchaseConfirmationTexts.payTotal.text(totalPriceString))
          : t(PurchaseConfirmationTexts.complete)
      }
      disabled={
        !!isOfferError ||
        reserveStatus === 'success' ||
        isFetchingPaymentAgreements
      }
      onPress={() => {
        if (paymentMethod) {
          analytics.logEvent('Ticketing', 'Confirm payment button clicked', {
            paymentMethod: paymentMethod?.paymentType,
            mode: mode,
            ...tripAnalytics,
          });
        }
        onGoToPayment();
      }}
      loading={reserveStatus === 'pending'}
      testID="confirmPaymentButton"
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme, {top, bottom}) => ({
  container: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
  paymentInProgressScreen: {
    flex: 1,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.medium + bottom,
    marginTop: top,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: theme.spacing.medium,
  },
}));
