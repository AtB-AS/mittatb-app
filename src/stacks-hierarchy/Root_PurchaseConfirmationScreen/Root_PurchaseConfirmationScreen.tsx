import {useAnalytics} from '@atb/analytics';
import {MasterCard, Vipps, Visa} from '@atb/assets/svg/color/icons/ticketing';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {useOtherDeviceIsInspectableWarning} from '@atb/fare-contracts/utils';
import {GlobalMessage, GlobalMessageContextEnum} from '@atb/global-messages';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, useTheme} from '@atb/theme';
import {PaymentType, ReserveOffer} from '@atb/ticketing';
import {
  PurchaseConfirmationTexts,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {addMinutes} from 'date-fns';
import React, {useMemo, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useOfferState} from '../Root_PurchaseOverviewScreen/use-offer-state';
import {usePreviousPaymentMethods} from '../saved-payment-utils';
import {PaymentMethod} from '../types';
import {PreassignedFareContractSummary} from './PreassignedFareProductSummary';
import {SelectPaymentMethodSheet} from './components/SelectPaymentMethodSheet';
import {ZoneSelectionMode} from '@atb-as/config-specs';

type Props = RootStackScreenProps<'Root_PurchaseConfirmationScreen'>;

export const Root_PurchaseConfirmationScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const {previousPaymentMethod, recurringPaymentMethods} =
    usePreviousPaymentMethods();
  const analytics = useAnalytics();

  const inspectableTokenWarningText = useOtherDeviceIsInspectableWarning();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>();
  const [shouldSavePaymentMethod, setShouldSavePaymentMethod] = useState(false);
  const paymentMethod = selectedPaymentMethod ?? previousPaymentMethod;

  const {
    fareProductTypeConfig,
    fromPlace,
    toPlace,
    preassignedFareProduct,
    userProfilesWithCount,
    travelDate,
    headerLeftButton,
    recipient,
  } = params;

  const offerEndpoint = getOfferEndpoint(
    fareProductTypeConfig.configuration.zoneSelectionMode,
  );
  const isOnBehalfOf = !!recipient;

  const preassignedFareProductAlternatives = useMemo(
    () => [preassignedFareProduct],
    [preassignedFareProduct],
  );

  const {
    offerSearchTime,
    isSearchingOffer,
    error,
    validDurationSeconds,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
  } = useOfferState(
    offerEndpoint,
    preassignedFareProductAlternatives,
    fromPlace,
    toPlace,
    userProfilesWithCount,
    isOnBehalfOf,
    travelDate,
  );

  const offers: ReserveOffer[] = userProfilesWithCountAndOffer.map(
    ({count, offer: {offer_id}}) => ({
      count,
      offer_id,
    }),
  );

  function goToPayment(
    method: PaymentMethod,
    shouldSavePaymentMethod: boolean,
  ) {
    const offerExpirationTime =
      offerSearchTime && addMinutes(offerSearchTime, 30).getTime();
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        analytics.logEvent('Ticketing', 'Pay with card selected', {
          paymentMethod: method,
        });
        navigation.push('Root_PurchasePaymentScreen', {
          offers,
          preassignedFareProduct: params.preassignedFareProduct,
          paymentMethod: method,
          shouldSavePaymentMethod,
        });
      }
    }
  }

  function getPaymentMethodTexts(method: PaymentMethod): string {
    let str;
    switch (method.paymentType) {
      case PaymentType.Vipps:
        str = t(PurchaseConfirmationTexts.payWithVipps.text);
        break;
      case PaymentType.Visa:
        str = t(PurchaseConfirmationTexts.payWithVisa.text);
        break;
      case PaymentType.Mastercard:
        str = t(PurchaseConfirmationTexts.payWithMasterCard.text);
        break;
    }
    if (method.recurringCard) {
      str = str + ` (**** ${method.recurringCard.masked_pan})`;
    }
    return str;
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
    });
  }

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(PurchaseConfirmationTexts.title)}
        leftButton={headerLeftButton}
        globalMessageContext={GlobalMessageContextEnum.appTicketing}
      />
      <ScrollView style={styles.infoSection}>
        {error && (
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
          fareProductTypeConfig={fareProductTypeConfig}
          fromPlace={fromPlace}
          toPlace={toPlace}
          isSearchingOffer={isSearchingOffer}
          preassignedFareProduct={preassignedFareProduct}
          totalPrice={totalPrice}
          userProfilesWithCountAndOffer={userProfilesWithCountAndOffer}
          recipient={recipient}
          travelDate={travelDate}
          validDurationSeconds={validDurationSeconds}
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
            preassignedFareProductType: preassignedFareProduct.type,
          }}
        />
        {isSearchingOffer ? (
          <ActivityIndicator
            size="large"
            color={theme.text.colors.primary}
            style={{margin: theme.spacings.medium}}
          />
        ) : (
          <View>
            {paymentMethod ? (
              <View style={styles.flexColumn}>
                <Button
                  text={getPaymentMethodTexts(paymentMethod)}
                  interactiveColor="interactive_0"
                  disabled={!!error}
                  rightIcon={{
                    svg: getPaymentTypeSvg(paymentMethod.paymentType),
                  }}
                  onPress={() => {
                    analytics.logEvent(
                      'Ticketing',
                      'Pay with previous payment method clicked',
                      {
                        paymentMethod: paymentMethod?.paymentType,
                        mode: params.mode,
                      },
                    );
                    goToPayment(paymentMethod, shouldSavePaymentMethod);
                  }}
                />
                <PressableOpacity
                  style={styles.buttonTopSpacing}
                  disabled={!!error}
                  onPress={() => {
                    analytics.logEvent(
                      'Ticketing',
                      'Change payment method clicked',
                      {
                        paymentMethod: paymentMethod?.paymentType,
                        mode: params.mode,
                      },
                    );
                    selectPaymentMethod();
                  }}
                  accessibilityHint={t(
                    PurchaseConfirmationTexts.changePaymentMethod.a11yHint,
                  )}
                >
                  <View style={styles.flexRowCenter}>
                    <ThemeText type="body__primary--bold">
                      {t(PurchaseConfirmationTexts.changePaymentMethod.text)}
                    </ThemeText>
                  </View>
                </PressableOpacity>
              </View>
            ) : (
              <Button
                interactiveColor="interactive_0"
                text={t(PurchaseConfirmationTexts.choosePaymentMethod.text)}
                disabled={!!error}
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
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

function getPaymentTypeSvg(paymentType: PaymentType) {
  switch (paymentType) {
    case PaymentType.Mastercard:
      return MasterCard;
    case PaymentType.Vipps:
      return Vipps;
    case PaymentType.Visa:
      return Visa;
  }
}

function getOfferEndpoint(zoneSelectionMode: ZoneSelectionMode) {
  switch (zoneSelectionMode) {
    case 'none':
      return 'authority';
    case 'multiple-stop-harbor':
      return 'stop-places';
    default:
      return 'zones';
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  flexRowCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonTopSpacing: {
    marginTop: theme.spacings.xLarge,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  warningMessage: {
    marginBottom: theme.spacings.medium,
  },
  infoSection: {padding: theme.spacings.medium},
  purchaseInformation: {
    marginBottom: theme.spacings.medium,
  },
}));
