import {MasterCard, Vipps, Visa} from '@atb/assets/svg/icons/ticketing';
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
import {ReserveOffer} from '@atb/tickets';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {RouteProp} from '@react-navigation/native';
import {addMinutes} from 'date-fns';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {TicketingStackParams} from '../';
import useOfferState from '../Overview/use-offer-state';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import {createTravelDateText} from '@atb/screens/Ticketing/Purchase/Overview';
import {formatToLongDateTime} from '@atb/utils/date';
import {formatDecimalNumber} from '@atb/utils/numbers';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {SelectCreditCard} from '../Payment';
import {
  PaymentOption,
  PaymentOption as PaymentOptionType,
  usePreferences,
} from '@atb/preferences';
import {useState} from 'react';
import {useEffect} from 'react';

export type RouteParams = {
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone: TariffZone;
  toTariffZone: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  travelDate?: string;
  headerLeftButton: LeftButtonProps;
};

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
  const {preferences, getSavedPaymentOptions} = usePreferences();
  const [paymentOptions, setPaymentOptions] = useState<
    Array<PaymentOptionType>
  >([]);

  async function fetchPaymentOptions(): Promise<void> {
    setPaymentOptions(await getSavedPaymentOptions());
  }

  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  const {
    enable_creditcard: enableCreditCard,
    vat_percent: vatPercent,
  } = useRemoteConfig();

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

  async function payWithVipps(option: PaymentOptionType) {
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentVipps', {
          offers,
          preassignedFareProduct: params.preassignedFareProduct,
          paymentOption: option,
        });
      }
    }
  }

  async function payWithCard(option: PaymentOptionType) {
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentCreditCard', {
          offers,
          preassignedFareProduct: params.preassignedFareProduct,
          paymentOption: option,
        });
      }
    }
  }

  function selectPaymentOption(option: PaymentOptionType) {
    switch (option.type) {
      case 2:
        payWithVipps(option);
        break;
      case 1 | 3:
        payWithCard(option);
        break;
      case 4:
        payWithCard(option);
        break;
    }
  }

  function getPaymentOptionTexts(option: PaymentOption): string {
    let str;
    switch (option.type) {
      case 2:
        str = t(PurchaseConfirmationTexts.payWithVipps.text);
        break;
      case 1 | 3:
        str = t(PurchaseConfirmationTexts.payWithVisa.text);
        break;
      case 4:
        str = t(PurchaseConfirmationTexts.payWithMasterCard.text);
        break;
      default:
        str = '';
    }
    str =
      str +
      ` (**** ${
        paymentOptions.find((item) => item.id == option.id)?.masked_pan
      })`;
    return str;
  }

  function selectPaymentMethod() {
    openBottomSheet((close) => {
      return (
        <SelectCreditCard
          onSelect={(option: PaymentOptionType) => {
            selectPaymentOption(option);
            close();
          }}
          options={paymentOptions}
        ></SelectCreditCard>
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
              retryFunction={refreshOffer}
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
            {paymentOptions.filter(
              (item) => item.id == preferences.previousPaymentMethod?.id,
            ).length === 0 ? (
              <Button
                color="primary_2"
                text={t(PurchaseConfirmationTexts.choosePaymentOption.text)}
                disabled={!!error || !paymentOptions.length}
                accessibilityHint={t(
                  PurchaseConfirmationTexts.choosePaymentOption.a11yHint,
                )}
                onPress={selectPaymentMethod}
                viewContainerStyle={styles.paymentButton}
              ></Button>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                }}
              >
                <Button
                  text={getPaymentOptionTexts(
                    preferences.previousPaymentMethod!,
                  )}
                  color="primary_2"
                  disabled={
                    !!error ||
                    !paymentOptions.length ||
                    !preferences.previousPaymentMethod
                  }
                  iconPosition="right"
                  icon={
                    preferences.previousPaymentMethod?.type === 4
                      ? MasterCard
                      : preferences.previousPaymentMethod?.type === 2
                      ? Vipps
                      : Visa
                  }
                  viewContainerStyle={styles.paymentButton}
                  onPress={() => {
                    selectPaymentOption(preferences.previousPaymentMethod!);
                  }}
                ></Button>
                <TouchableOpacity
                  style={{
                    marginTop: 24,
                  }}
                  disabled={!!error || !paymentOptions.length}
                  onPress={selectPaymentMethod}
                  accessibilityHint={t(
                    PurchaseConfirmationTexts.choosePaymentOption.a11yHint,
                  )}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '400',
                        fontSize: 16,
                      }}
                    >
                      {t(PurchaseConfirmationTexts.choosePaymentOption.text)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
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
    backgroundColor: theme.colors.background_2.backgroundColor,
  },
  ticketsContainer: {
    backgroundColor: theme.colors.background_0.backgroundColor,
    borderTopEndRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background_1.backgroundColor,
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
    backgroundColor: theme.colors.background_0.backgroundColor,
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
