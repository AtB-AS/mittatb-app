import {MasterCard, Vipps, Visa} from '@atb/assets/svg/color/icons/ticketing';
import {useAuthState} from '@atb/auth';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {LeftButtonProps} from '@atb/components/screen-header';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {PreassignedFareProduct, TariffZone} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {PaymentType, ReserveOffer} from '@atb/ticketing';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {formatToLongDateTime} from '@atb/utils/date';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {addMinutes} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {getOtherDeviceIsInspectableWarning} from '../../FareContracts/utils';
import useOfferState from '../Overview/use-offer-state';
import {SelectPaymentMethod} from '../Payment';
import {usePreviousPaymentMethod} from '../saved-payment-utils';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import {
  CardPaymentMethod,
  PaymentMethod,
  PurchaseScreenProps,
  SavedPaymentOption,
} from '../types';

export type RouteParams = {
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone: TariffZone;
  toTariffZone: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  travelDate?: string;
  headerLeftButton: LeftButtonProps;
};

function getPreviousPaymentMethod(
  previousPaymentMethod: SavedPaymentOption | undefined,
  paymentTypes: PaymentType[],
): PaymentMethod | undefined {
  if (!previousPaymentMethod) return undefined;

  if (!paymentTypes.includes(previousPaymentMethod.paymentType))
    return undefined;

  switch (previousPaymentMethod.savedType) {
    case 'normal':
      if (previousPaymentMethod.paymentType === PaymentType.Vipps) {
        return {paymentType: PaymentType.Vipps};
      } else {
        return {
          paymentType: previousPaymentMethod.paymentType,
          save: false,
        };
      }
    case 'recurring':
      return {
        paymentType: previousPaymentMethod.paymentType,
        recurringPaymentId: previousPaymentMethod.recurringCard.id,
      };
    case 'recurring-without-card':
      return {
        paymentType: previousPaymentMethod.paymentType,
        recurringPaymentId: previousPaymentMethod.recurringPaymentId,
      };
  }
}

type ConfirmationProps = PurchaseScreenProps<'Confirmation'>;

const Confirmation: React.FC<ConfirmationProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const {open: openBottomSheet} = useBottomSheet();
  const {user} = useAuthState();
  const {paymentTypes, vatPercent} = useFirestoreConfiguration();
  const [previousMethod, setPreviousMethod] = useState<
    PaymentMethod | undefined
  >(undefined);
  const previousPaymentMethod = usePreviousPaymentMethod(user);
  const {
    deviceIsInspectable,
    remoteTokens,
    fallbackEnabled,
    isError: mobileTokenError,
  } = useMobileTokenContextState();
  const tokensEnabled = useHasEnabledMobileToken();

  const inspectableTokenWarningText = getOtherDeviceIsInspectableWarning(
    tokensEnabled,
    mobileTokenError,
    fallbackEnabled,
    t,
    remoteTokens,
    deviceIsInspectable,
  );

  const {
    fromTariffZone,
    toTariffZone,
    preassignedFareProduct,
    userProfilesWithCount,
    travelDate,
    headerLeftButton,
  } = params;

  const {
    offerSearchTime,
    isSearchingOffer,
    error,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
  } = useOfferState(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
    travelDate,
  );

  const offerExpirationTime =
    offerSearchTime && addMinutes(offerSearchTime, 30).getTime();

  const offers: ReserveOffer[] = userProfilesWithCountAndOffer.map(
    ({count, offer: {offer_id}}) => ({
      count,
      offer_id,
    }),
  );

  const vatAmount = totalPrice * (vatPercent / 100);

  const vatAmountString = formatDecimalNumber(vatAmount, language);
  const vatPercentString = formatDecimalNumber(vatPercent, language);
  const totalPriceString = formatDecimalNumber(totalPrice, language, 2);

  const travelDateText = travelDate
    ? t(
        PurchaseConfirmationTexts.travelDate.futureDate(
          formatToLongDateTime(travelDate, language),
        ),
      )
    : t(PurchaseConfirmationTexts.travelDate.now);

  useEffect(() => {
    const prevMethod = getPreviousPaymentMethod(
      previousPaymentMethod,
      paymentTypes,
    );
    setPreviousMethod(prevMethod);
  }, [previousPaymentMethod]);

  async function payWithVipps(option: PaymentMethod) {
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentVipps', {
          offers,
          preassignedFareProduct: params.preassignedFareProduct,
        });
      }
    }
  }

  async function payWithCard(option: CardPaymentMethod) {
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentCreditCard', {
          offers,
          preassignedFareProduct: params.preassignedFareProduct,
          paymentMethod: option,
        });
      }
    }
  }

  function selectPaymentOption(option: PaymentMethod) {
    switch (option.paymentType) {
      case PaymentType.Vipps:
        payWithVipps(option);
        break;
      default:
        payWithCard(option);
    }
  }

  function getPaymentOptionTexts(option: PaymentMethod): string {
    let str;
    switch (option.paymentType) {
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
    if (previousPaymentMethod) {
      const paymentOption = previousPaymentMethod;
      if (paymentOption?.savedType === 'recurring') {
        str = str + ` (**** ${paymentOption.recurringCard.masked_pan})`;
      }
    }
    return str;
  }

  async function selectPaymentMethod() {
    openBottomSheet((close) => {
      return (
        <SelectPaymentMethod
          onSelect={(option: PaymentMethod) => {
            selectPaymentOption(option);
            close();
          }}
          close={close}
          previousPaymentMethod={previousPaymentMethod}
        />
      );
    });
  }

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(
          PurchaseConfirmationTexts.header.title[preassignedFareProduct.type],
        )}
        leftButton={headerLeftButton}
        globalMessageContext="app-ticketing"
      />

      <ScrollView style={styles.infoSection}>
        <View>
          {error && (
            <MessageBox
              type="error"
              title={t(PurchaseConfirmationTexts.errorMessageBox.title)}
              message={t(PurchaseConfirmationTexts.errorMessageBox.message)}
              onPress={refreshOffer}
              onPressText={t(MessageBoxTexts.tryAgainButton)}
              style={styles.errorMessage}
            />
          )}

          <View>
            <Sections.Section>
              <Sections.GenericItem>
                {userProfilesWithCountAndOffer.map((u, i) => (
                  <View
                    accessible={true}
                    key={u.id}
                    style={[
                      styles.userProfileItem,
                      i != 0 ? styles.smallTopMargin : undefined,
                    ]}
                  >
                    <ThemeText>
                      {u.count} {getReferenceDataName(u, language)}
                    </ThemeText>
                    <ThemeText>
                      {formatDecimalNumber(
                        u.count * (u.offer.prices[0].amount_float || 0),
                        language,
                        2,
                      )}{' '}
                      kr
                    </ThemeText>
                  </View>
                ))}
              </Sections.GenericItem>
              <Sections.GenericItem>
                <View accessible={true}>
                  <ThemeText>
                    {getReferenceDataName(preassignedFareProduct, language)}
                  </ThemeText>
                  <ThemeText
                    style={styles.smallTopMargin}
                    type="body__secondary"
                    color="secondary"
                  >
                    {fromTariffZone.id === toTariffZone.id
                      ? t(
                          PurchaseConfirmationTexts.validityTexts.zone.single(
                            getReferenceDataName(fromTariffZone, language),
                          ),
                        )
                      : t(
                          PurchaseConfirmationTexts.validityTexts.zone.multiple(
                            getReferenceDataName(fromTariffZone, language),
                            getReferenceDataName(toTariffZone, language),
                          ),
                        )}
                  </ThemeText>
                  <ThemeText
                    style={styles.smallTopMargin}
                    type="body__secondary"
                    color="secondary"
                  >
                    {travelDateText}
                  </ThemeText>
                </View>
              </Sections.GenericItem>
            </Sections.Section>
          </View>
        </View>
        <View style={styles.totalContainer} accessible={true}>
          <View style={styles.totalContainerHeadings}>
            <ThemeText type="body__primary">
              {t(PurchaseConfirmationTexts.totalCost.title)}
            </ThemeText>
            <ThemeText type="body__tertiary" color="secondary">
              {t(
                PurchaseConfirmationTexts.totalCost.label(
                  vatPercentString,
                  vatAmountString,
                ),
              )}
            </ThemeText>
          </View>

          {!isSearchingOffer ? (
            <ThemeText type="body__primary--jumbo">
              {totalPriceString} kr
            </ThemeText>
          ) : (
            <ActivityIndicator
              size={theme.spacings.medium}
              color={theme.text.colors.primary}
              style={{margin: theme.spacings.medium}}
            />
          )}
        </View>
        <MessageBox
          type="info"
          message={
            travelDate
              ? t(
                  PurchaseConfirmationTexts.infoText.validInFuture(
                    formatToLongDateTime(travelDate, language),
                  ),
                )
              : t(PurchaseConfirmationTexts.infoText.validNow)
          }
        />
        {inspectableTokenWarningText && (
          <MessageBox
            type="warning"
            message={inspectableTokenWarningText}
            style={styles.warningMessage}
            isMarkdown={true}
          />
        )}
        {isSearchingOffer ? (
          <ActivityIndicator
            size="large"
            color={theme.text.colors.primary}
            style={{margin: theme.spacings.medium}}
          />
        ) : (
          <View>
            {previousMethod ? (
              <View style={styles.flexColumn}>
                <Button
                  text={getPaymentOptionTexts(previousMethod)}
                  interactiveColor="interactive_0"
                  disabled={!!error || !previousMethod}
                  rightIcon={{
                    svg:
                      previousMethod.paymentType === PaymentType.Mastercard
                        ? MasterCard
                        : previousMethod.paymentType === PaymentType.Vipps
                        ? Vipps
                        : Visa,
                  }}
                  viewContainerStyle={styles.paymentButton}
                  onPress={() => {
                    if (previousMethod) {
                      selectPaymentOption(previousMethod);
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.buttonTopSpacing}
                  disabled={!!error}
                  onPress={() => {
                    selectPaymentMethod();
                  }}
                  accessibilityHint={t(
                    PurchaseConfirmationTexts.changePaymentOption.a11yHint,
                  )}
                >
                  <View style={styles.flexRowCenter}>
                    <ThemeText type="body__primary--bold">
                      {t(PurchaseConfirmationTexts.changePaymentOption.text)}
                    </ThemeText>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                interactiveColor="interactive_0"
                text={t(PurchaseConfirmationTexts.choosePaymentOption.text)}
                disabled={!!error}
                accessibilityHint={t(
                  PurchaseConfirmationTexts.choosePaymentOption.a11yHint,
                )}
                onPress={selectPaymentMethod}
                viewContainerStyle={styles.paymentButton}
                testID="choosePaymentOptionButton"
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
    backgroundColor: theme.static.background.background_2.background,
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
    marginTop: theme.spacings.medium,
  },
  infoSection: {padding: theme.spacings.medium},
  userProfileItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacings.medium,
    marginVertical: theme.spacings.medium,
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
  },
  totalContainerHeadings: {
    paddingVertical: theme.spacings.xSmall,
  },
  smallTopMargin: {
    marginTop: theme.spacings.xSmall,
  },
  paymentButton: {
    marginTop: theme.spacings.medium,
  },
}));

export default Confirmation;
