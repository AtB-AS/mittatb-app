import {MasterCard, Vipps, Visa} from '@atb/assets/svg/color/icons/ticketing';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import {LeftButtonProps} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import MessageBox from '@atb/components/message-box';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {PreassignedFareProduct, TariffZone} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {PaymentType, ReserveOffer} from '@atb/tickets';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {RouteProp} from '@react-navigation/native';
import {addMinutes} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import {TicketingStackParams} from '../';
import useOfferState from '../Overview/use-offer-state';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import {createTravelDateText} from '@atb/screens/Ticketing/Purchase/Overview';
import {formatToLongDateTime} from '@atb/utils/date';
import {formatDecimalNumber} from '@atb/utils/numbers';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {SelectPaymentMethod} from '../Payment';
import {CardPaymentMethod, PaymentMethod, SavedPaymentOption} from '../types';
import {useAuthState} from '@atb/auth';
import {usePreviousPaymentMethod} from '../saved-payment-utils';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

export type RouteParams = {
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone: TariffZone;
  toTariffZone: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  travelDate?: string;
  headerLeftButton: LeftButtonProps;
};

async function getPreviousPaymentMethod(
  previousPaymentMethod: SavedPaymentOption | undefined,
  paymentTypes: PaymentType[],
): Promise<PaymentMethod | undefined> {
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

export type ConfirmationProps = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'Confirmation'
  >;
  route: RouteProp<TicketingStackParams, 'Confirmation'>;
};

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

  const {enable_creditcard: enableCreditCard} = useRemoteConfig();

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

  useEffect(() => {
    const getPrevMethod = async () => {
      const prevMethod = await getPreviousPaymentMethod(
        previousPaymentMethod,
        paymentTypes,
      );
      setPreviousMethod(prevMethod);
    };

    getPrevMethod();
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
        alertContext="ticketing"
      />

      <ScrollView style={styles.ticketInfoSection}>
        <View>
          {error && (
            <MessageBox
              type="error"
              title={t(PurchaseConfirmationTexts.errorMessageBox.title)}
              message={t(PurchaseConfirmationTexts.errorMessageBox.message)}
              onPress={refreshOffer}
              onPressText={t(MessageBoxTexts.tryAgainButton)}
              containerStyle={styles.errorMessage}
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
                      {u.count * (u.offer.prices[0].amount_float || 0)} kr
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
                    {createTravelDateText(t, language, travelDate)}
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
            <ThemeText type="body__primary--jumbo">{totalPrice} kr</ThemeText>
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
                  iconPosition="right"
                  icon={
                    previousMethod.paymentType === PaymentType.Mastercard
                      ? MasterCard
                      : previousMethod.paymentType === PaymentType.Vipps
                      ? Vipps
                      : Visa
                  }
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
  ticketsContainer: {
    backgroundColor: theme.static.background.background_0.background,
    borderTopEndRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
    borderBottomWidth: 1,
    borderBottomColor: theme.static.background.background_1.background,
    padding: theme.spacings.medium,
    marginTop: theme.spacings.small,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  ticketInfoSection: {padding: theme.spacings.medium},
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
