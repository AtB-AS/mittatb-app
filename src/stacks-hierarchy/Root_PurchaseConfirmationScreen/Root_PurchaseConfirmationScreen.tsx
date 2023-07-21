import {MasterCard, Vipps, Visa} from '@atb/assets/svg/color/icons/ticketing';
import {useAuthState} from '@atb/auth';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
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
  Language,
  PurchaseConfirmationTexts,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime, secondsToDuration} from '@atb/utils/date';
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
import {getOtherDeviceIsInspectableWarning} from '@atb/fare-contracts/utils';
import {
  useOfferState,
  UserProfileWithCountAndOffer,
} from '../Root_PurchaseOverviewScreen/use-offer-state';
import {SelectPaymentMethod} from './components/SelectPaymentMethodSheet';
import {usePreviousPaymentMethod} from '../saved-payment-utils';
import {CardPaymentMethod, PaymentMethod, SavedPaymentOption} from '../types';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {useAnalytics} from '@atb/analytics';
import {Info} from '@atb/assets/svg/color/icons/status';
import {TariffZone} from '@atb/reference-data/types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

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
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
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
  const analytics = useAnalytics();

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
    fromPlace,
    toPlace,
    preassignedFareProduct,
    userProfilesWithCount,
    travelDate,
    headerLeftButton,
  } = params;

  const {travellerSelectionMode, zoneSelectionMode} =
    fareProductTypeConfig.configuration;

  const offerEndpoint =
    zoneSelectionMode === 'none'
      ? 'authority'
      : zoneSelectionMode === 'multiple-stop-harbor'
      ? 'stop-places'
      : 'zones';

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
    preassignedFareProduct,
    fromPlace,
    toPlace,
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
  const fromPlaceName = getPlaceName(fromPlace, language);

  const toPlaceName = getPlaceName(toPlace, language);
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
        analytics.logEvent('Ticketing', 'Pay with Vipps selected');
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
        analytics.logEvent('Ticketing', 'Pay with card selected', {
          paymentMethod: option,
        });
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
    openBottomSheet(() => {
      return (
        <SelectPaymentMethod
          onSelect={(option: PaymentMethod) => {
            selectPaymentOption(option);
            closeBottomSheet();
          }}
          close={closeBottomSheet}
          previousPaymentMethod={previousPaymentMethod}
        />
      );
    });
  }
  function summary(text?: string) {
    return (
      <ThemeText
        style={styles.smallTopMargin}
        type="body__secondary"
        color="secondary"
      >
        {text}
      </ThemeText>
    );
  }

  const SummaryText = () => {
    switch (zoneSelectionMode) {
      case 'multiple-stop-harbor':
        return (
          <>
            {summary(
              fareProductTypeConfig.type.includes('single')
                ? t(
                    PurchaseConfirmationTexts.validityTexts.harbor.single(
                      fromPlaceName,
                      toPlaceName,
                    ),
                  )
                : t(
                    PurchaseConfirmationTexts.validityTexts.harbor.period(
                      fromPlaceName,
                      toPlaceName,
                    ),
                  ),
            )}
            {summary(
              t(
                PurchaseConfirmationTexts.validityTexts.harbor
                  .messageInHarborZones,
              ),
            )}
          </>
        );
      case 'none':
        return summary(
          getTextForLanguage(
            preassignedFareProduct.description ?? [],
            language,
          ),
        );
      default:
        return summary(
          fromPlace.id === toPlace.id
            ? t(
                PurchaseConfirmationTexts.validityTexts.zone.single(
                  fromPlaceName,
                ),
              )
            : t(
                PurchaseConfirmationTexts.validityTexts.zone.multiple(
                  fromPlaceName,
                  toPlaceName,
                ),
              ),
        );
    }
  };

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
          <Section>
            <GenericSectionItem>
              <View accessible={true}>
                <ThemeText>
                  {getReferenceDataName(preassignedFareProduct, language)}
                </ThemeText>
                <SummaryText />
                {!isSearchingOffer &&
                  validDurationSeconds &&
                  summary(
                    t(
                      PurchaseConfirmationTexts.validityTexts.time(
                        secondsToDuration(validDurationSeconds, language),
                      ),
                    ),
                  )}
                {fareProductTypeConfig.configuration.requiresTokenOnMobile &&
                  summary(
                    t(
                      PurchaseConfirmationTexts.validityTexts.harbor
                        .onlyOnPhone,
                    ),
                  )}

                <View style={[styles.smallTopMargin, {flexDirection: 'row'}]}>
                  <Info
                    height={theme.icon.size.normal}
                    width={theme.icon.size.normal}
                    style={{marginRight: theme.spacings.small}}
                  />
                  <ThemeText type="body__secondary" color="secondary">
                    {travelDateText}
                  </ThemeText>
                </View>
              </View>
            </GenericSectionItem>
          </Section>
        </View>

        <Section style={styles.paymentSummaryContainer}>
          {travellerSelectionMode !== 'none' && (
            <GenericSectionItem>
              {userProfilesWithCountAndOffer.map((u, i) => (
                <PricePerUserProfile
                  key={u.id}
                  userProfile={u}
                  style={i != 0 ? styles.smallTopMargin : undefined}
                />
              ))}
            </GenericSectionItem>
          )}
          <GenericSectionItem>
            <View style={styles.totalPaymentContainer} accessible={true}>
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
          </GenericSectionItem>
        </Section>

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
                    analytics.logEvent(
                      'Ticketing',
                      'Pay with previous payment method clicked',
                      {
                        paymentMethod: previousMethod?.paymentType,
                        mode: params.mode,
                      },
                    );
                    selectPaymentOption(previousMethod);
                  }}
                />
                <TouchableOpacity
                  style={styles.buttonTopSpacing}
                  disabled={!!error}
                  onPress={() => {
                    analytics.logEvent(
                      'Ticketing',
                      'Change payment method clicked',
                      {
                        paymentMethod: previousMethod?.paymentType,
                        mode: params.mode,
                      },
                    );
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
                  analytics.logEvent('Ticketing', 'Confirm purchase clicked', {
                    mode: params.mode,
                  });
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
      <ThemeText
        style={styles.userProfileCountAndName}
        color="secondary"
        type="body__secondary"
      >
        {count} {userProfileName}
      </ThemeText>
      <View style={styles.userProfilePrice}>
        {hasFlexDiscount && (
          <ThemeText
            type="body__tertiary"
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
        <ThemeText color="secondary" type="body__secondary">
          {priceString} kr
        </ThemeText>
      </View>
    </View>
  );
};

function getPlaceName(
  place: TariffZone | StopPlaceFragment,
  language: Language,
) {
  return 'geometry' in place
    ? getReferenceDataName(place, language)
    : place.name;
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
    alignSelf: 'center',
  },
  userProfileOriginalPriceAmount: {
    textDecorationLine: 'line-through',
  },
  paymentSummaryContainer: {
    marginVertical: theme.spacings.medium,
  },
  totalPaymentContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
