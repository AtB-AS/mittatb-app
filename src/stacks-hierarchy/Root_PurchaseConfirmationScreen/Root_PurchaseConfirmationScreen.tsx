import {MasterCard, Vipps, Visa} from '@atb/assets/svg/color/icons/ticketing';
import {useAuthState} from '@atb/auth';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {PaymentType, ReserveOffer} from '@atb/ticketing';
import {
  dictionary,
  getTextForLanguage,
  PurchaseConfirmationTexts,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {addMinutes} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {getOtherDeviceIsInspectableWarning} from '../Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import useOfferState, {
  UserProfileWithCountAndOffer,
} from '../Root_PurchaseOverviewScreen/use-offer-state';
import {SelectPaymentMethod} from './components/SelectPaymentMethodSheet';
import {usePreviousPaymentMethod} from '../saved-payment-utils';
import {CardPaymentMethod, PaymentMethod, SavedPaymentOption} from '../types';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import analytics from '@react-native-firebase/analytics';

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

type Props = RootStackScreenProps<'Root_PurchaseConfirmationScreen'>;

export const Root_PurchaseConfirmationScreen: React.FC<Props> = ({
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
    fareProductTypeConfig,
    fromTariffZone,
    toTariffZone,
    preassignedFareProduct,
    userProfilesWithCount,
    travelDate,
    headerLeftButton,
  } = params;

  const {travellerSelectionMode, zoneSelectionMode} =
    fareProductTypeConfig.configuration;

  const {
    offerSearchTime,
    isSearchingOffer,
    error,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
  } = useOfferState(
    zoneSelectionMode === 'none' ? 'authority' : 'zones',
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

  async function payWithVipps() {
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('Root_PurchasePaymentWithVippsScreen', {
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
        navigation.push('Root_PurchasePaymentWithCreditCardScreen', {
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
        payWithVipps();
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
        title={getTextForLanguage(fareProductTypeConfig.name, language)}
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
              onPressConfig={{
                action: refreshOffer,
                text: t(dictionary.retry),
              }}
              style={styles.errorMessage}
            />
          )}

          <View>
            <Sections.Section>
              {travellerSelectionMode !== 'none' && (
                <Sections.GenericSectionItem>
                  {userProfilesWithCountAndOffer.map((u, i) => (
                    <PricePerUserProfile
                      key={u.id}
                      userProfile={u}
                      style={i != 0 ? styles.smallTopMargin : undefined}
                    />
                  ))}
                </Sections.GenericSectionItem>
              )}
              <Sections.GenericSectionItem>
                <View accessible={true}>
                  <ThemeText>
                    {getReferenceDataName(preassignedFareProduct, language)}
                  </ThemeText>
                  {zoneSelectionMode !== 'none' ? (
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
                  ) : (
                    <ThemeText
                      style={styles.smallTopMargin}
                      type="body__secondary"
                      color="secondary"
                    >
                      {getTextForLanguage(
                        preassignedFareProduct.description ?? [],
                        language,
                      )}
                    </ThemeText>
                  )}
                  <ThemeText
                    style={styles.smallTopMargin}
                    type="body__secondary"
                    color="secondary"
                  >
                    {travelDateText}
                  </ThemeText>
                </View>
              </Sections.GenericSectionItem>
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
                  disabled={!!error}
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
                    params.mode === 'TravelSearch' &&
                      analytics().logEvent('purchase_from_travel_search');
                    selectPaymentOption(previousMethod);
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
                onPress={() => {
                  params.mode === 'TravelSearch' &&
                    analytics().logEvent('purchase_from_travel_search');
                  selectPaymentMethod();
                }}
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

const PricePerUserProfile = ({
  userProfile,
  style,
}: {
  userProfile: UserProfileWithCountAndOffer;
  style: StyleProp<ViewStyle>;
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {count, offer} = userProfile;

  const price = count * (offer.prices[0].amount_float || 0);
  const originalPrice = count * (offer.prices[0].original_amount_float || 0);

  const priceString = formatDecimalNumber(price, language, 2);
  const originalPriceString = originalPrice
    ? formatDecimalNumber(originalPrice, language, 2)
    : undefined;

  const hasFlexDiscount = price < originalPrice;

  const userProfileName = getReferenceDataName(userProfile, language);
  const a11yLabel = [
    `${count} ${userProfileName}`,
    `${priceString} kr`,
    `${
      hasFlexDiscount
        ? `${t(
            PurchaseConfirmationTexts.ordinaryPricePrefixA11yLabel,
          )} ${originalPriceString} kr`
        : ''
    }`,
  ].join(',');

  return (
    <View
      accessible={true}
      accessibilityLabel={a11yLabel}
      style={[style, styles.userProfileItem]}
    >
      <ThemeText style={styles.userProfileCountAndName}>
        {count} {userProfileName}
      </ThemeText>
      <View style={styles.userProfilePrice}>
        {hasFlexDiscount && (
          <ThemeText
            type="body__secondary"
            color="secondary"
            style={styles.userProfileOriginalPriceText}
          >
            ({`${t(PurchaseConfirmationTexts.ordinaryPricePrefix)} `}
            <Text style={styles.userProfileOriginalPriceAmount}>
              {originalPriceString} kr
            </Text>
            )
          </ThemeText>
        )}
        <ThemeText>{priceString} kr</ThemeText>
      </View>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userProfileCountAndName: {marginRight: theme.spacings.small},
  userProfilePrice: {flexDirection: 'row', flexWrap: 'wrap'},
  userProfileOriginalPriceText: {
    marginRight: theme.spacings.small,
  },
  userProfileOriginalPriceAmount: {
    textDecorationLine: 'line-through',
  },
  totalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
