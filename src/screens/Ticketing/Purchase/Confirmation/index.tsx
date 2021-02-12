import {ReserveOffer} from '@atb/api/fareContracts';
import {CreditCard, Vipps} from '@atb/assets/svg/icons/ticketing';
import Button from '@atb/components/button';
import Header, {LeftButtonProps} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import MessageBox from '@atb/message-box';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {PreassignedFareProduct, TariffZone} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {RouteProp} from '@react-navigation/native';
import {addMinutes} from 'date-fns';
import React from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TicketingStackParams} from '../';
import useOfferState from '../Overview/use-offer-state';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';

export type RouteParams = {
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone: TariffZone;
  toTariffZone: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
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

  const {enable_creditcard: enableCreditCard} = useRemoteConfig();

  const {
    fromTariffZone,
    toTariffZone,
    preassignedFareProduct,
    userProfilesWithCount,
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
  );

  const offerExpirationTime =
    offerSearchTime && addMinutes(offerSearchTime, 30).getTime();

  const offers: ReserveOffer[] = userProfilesWithCountAndOffer.map(
    ({count, offer: {offer_id}}) => ({
      count,
      offer_id,
    }),
  );

  async function payWithVipps() {
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

  async function payWithCard() {
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentCreditCard', {
          offers,
          preassignedFareProduct: params.preassignedFareProduct,
        });
      }
    }
  }

  const {top: safeAreaTop, bottom: safeAreBottom} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: safeAreaTop}]}>
      <Header
        title={getReferenceDataName(preassignedFareProduct, language)}
        leftButton={headerLeftButton}
        style={styles.header}
      />

      <ScrollView style={styles.ticketInfoSection}>
        <View>
          {error && (
            <MessageBox
              type="warning"
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
                      {u.count * (u.offer.prices[0].amount_float || 0)},-
                    </ThemeText>
                  </View>
                ))}
              </Sections.GenericItem>
              <Sections.GenericItem>
                <View>
                  <ThemeText>
                    {getReferenceDataName(preassignedFareProduct, language)}
                  </ThemeText>
                  <ThemeText
                    style={styles.smallTopMargin}
                    type="lead"
                    color="faded"
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
                    type="lead"
                    color="faded"
                  >
                    {t(PurchaseConfirmationTexts.validityTexts.startTime)}
                  </ThemeText>
                </View>
              </Sections.GenericItem>
            </Sections.Section>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <View style={styles.totalContainerHeadings}>
            <ThemeText type="body">
              {t(PurchaseConfirmationTexts.totalCost.title)}
            </ThemeText>
            <ThemeText type="label" color={'faded'}>
              {t(PurchaseConfirmationTexts.totalCost.label)}
            </ThemeText>
          </View>

          {!isSearchingOffer ? (
            <ThemeText type="heroTitle">{totalPrice} kr</ThemeText>
          ) : (
            <ActivityIndicator
              size={theme.spacings.medium}
              color={theme.text.colors.primary}
              style={{margin: 12}}
            />
          )}
        </View>

        <MessageBox type="info">
          <ThemeText style={{paddingBottom: theme.spacings.medium}}>
            {t(PurchaseConfirmationTexts.infoText.part1)}
          </ThemeText>
          {/*<ThemeText>{t(PurchaseConfirmationTexts.infoText.part2)}</ThemeText>*/}
        </MessageBox>

        <View
          style={{
            paddingBottom: Math.max(safeAreBottom, theme.spacings.medium),
          }}
        >
          <Button
            mode="primary2"
            text={t(PurchaseConfirmationTexts.paymentButtonVipps.text)}
            disabled={isSearchingOffer || !!error}
            accessibilityHint={t(
              PurchaseConfirmationTexts.paymentButtonVipps.a11yHint,
            )}
            icon={Vipps}
            iconPosition="left"
            onPress={payWithVipps}
            viewContainerStyle={styles.paymentButton}
          />
          {enableCreditCard && (
            <Button
              mode="primary2"
              text={t(PurchaseConfirmationTexts.paymentButtonCard.text)}
              disabled={isSearchingOffer || !!error}
              accessibilityHint={t(
                PurchaseConfirmationTexts.paymentButtonCard.a11yHint,
              )}
              icon={CreditCard}
              iconPosition="left"
              onPress={payWithCard}
              viewContainerStyle={styles.paymentButton}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  ticketsContainer: {
    backgroundColor: theme.background.level0,
    borderTopEndRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
    borderBottomWidth: 1,
    borderBottomColor: theme.background.level1,
    padding: theme.spacings.medium,
    marginTop: theme.spacings.small,
  },
  header: {
    paddingHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  ticketInfoSection: {paddingHorizontal: theme.spacings.medium},
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
    backgroundColor: theme.background.level0,
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
