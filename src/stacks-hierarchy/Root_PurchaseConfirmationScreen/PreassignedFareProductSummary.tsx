import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {MessageInfoText} from '@atb/components/message-info-text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {
  FareProductTypeConfig,
  PreassignedFareProduct,
  TariffZone,
  getReferenceDataName,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {GlobalMessage, GlobalMessageContextEnum} from '@atb/global-messages';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  Language,
  PurchaseConfirmationTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime, secondsToDuration} from '@atb/utils/date';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils.ts';
import React from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {UserProfileWithCountAndOffer} from '../Root_PurchaseOverviewScreen/use-offer-state';
import {useShowValidTimeInfoEnabled} from '../Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-show-valid-time-info-enabled';
import {TicketRecipientType} from '../types';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  fareProductTypeConfig: FareProductTypeConfig;
  recipient?: TicketRecipientType;
  isSearchingOffer: boolean;
  fromPlace: TariffZone | StopPlaceFragment;
  toPlace: TariffZone | StopPlaceFragment;
  userProfilesWithCountAndOffer: UserProfileWithCountAndOffer[];
  validDurationSeconds?: number;
  travelDate?: string;
  totalPrice: number;
};

export const PreassignedFareContractSummary = ({
  preassignedFareProduct,
  recipient,
  fareProductTypeConfig,
  isSearchingOffer,
  fromPlace,
  toPlace,
  userProfilesWithCountAndOffer,
  travelDate,
  validDurationSeconds,
  totalPrice,
}: Props) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const {vatPercent} = useFirestoreConfiguration();
  const isShowValidTimeInfoEnabled = useShowValidTimeInfoEnabled();

  const {travellerSelectionMode, zoneSelectionMode} =
    fareProductTypeConfig.configuration;

  const fromPlaceName = getPlaceName(fromPlace, language);
  const toPlaceName = getPlaceName(toPlace, language);

  const vatAmount = totalPrice - totalPrice / (1 + vatPercent / 100);

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

  function summary(text?: string) {
    if (!text) return null;
    return (
      <ThemeText
        style={styles.smallTopMargin}
        type="body__secondary"
        color="secondary"
        testID="summaryText"
      >
        {text}
      </ThemeText>
    );
  }

  const SummaryText = () => {
    switch (zoneSelectionMode) {
      case 'multiple-stop-harbor':
        return summary(
          t(
            PurchaseConfirmationTexts.validityTexts.harbor.messageInHarborZones,
          ),
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
    <View>
      <View>
        <Section>
          <GenericSectionItem>
            <View accessible={true} style={styles.ticketInfoContainer}>
              <ThemeText>
                {getReferenceDataName(preassignedFareProduct, language)}
              </ThemeText>
              {recipient && (
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  style={styles.sendingToText}
                  testID="onBehalfOfText"
                >
                  {t(
                    PurchaseConfirmationTexts.sendingTo(
                      recipient.name ||
                        formatPhoneNumber(recipient.phoneNumber),
                    ),
                  )}
                </ThemeText>
              )}
              {fareProductTypeConfig.direction &&
                summary(
                  t(
                    PurchaseConfirmationTexts.validityTexts.direction[
                      fareProductTypeConfig.direction
                    ](fromPlaceName, toPlaceName),
                  ),
                )}
              <SummaryText />
              {!isSearchingOffer &&
                validDurationSeconds &&
                isShowValidTimeInfoEnabled &&
                summary(
                  t(
                    PurchaseConfirmationTexts.validityTexts.time(
                      secondsToDuration(validDurationSeconds, language),
                    ),
                  ),
                )}
              {fareProductTypeConfig.configuration.requiresTokenOnMobile &&
                summary(
                  t(PurchaseConfirmationTexts.validityTexts.harbor.onlyOnPhone),
                )}
              <GlobalMessage
                style={styles.globalMessage}
                globalMessageContext={
                  GlobalMessageContextEnum.appPurchaseConfirmation
                }
                textColor="secondary"
                ruleVariables={{
                  preassignedFareProductType: preassignedFareProduct.type,
                }}
              />
              {!fareProductTypeConfig.isCollectionOfAccesses && (
                <MessageInfoText
                  style={styles.smallTopMargin}
                  type="info"
                  message={travelDateText}
                  textColor="secondary"
                />
              )}
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
              <ThemeText type="body__primary--jumbo" testID="totalPrice">
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
        testID="userProfileCountAndName"
      >
        {count} {userProfileName}
      </ThemeText>
      <View style={styles.userProfilePrice}>
        {hasFlexDiscount && (
          <ThemeText
            type="body__tertiary"
            color="secondary"
            style={styles.userProfileOriginalPriceAmount}
          >
            {originalPriceString} kr
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
  userProfileItem: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userProfileCountAndName: {marginRight: theme.spacings.small},
  userProfilePrice: {flexDirection: 'row', flexWrap: 'wrap'},
  userProfileOriginalPriceAmount: {
    marginEnd: theme.spacings.small,
    alignSelf: 'flex-end',
    textDecorationLine: 'line-through',
  },
  paymentSummaryContainer: {
    marginVertical: theme.spacings.medium,
  },
  sendingToText: {
    marginTop: theme.spacings.xSmall,
  },
  ticketInfoContainer: {
    flex: 1,
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
  globalMessage: {
    marginTop: theme.spacings.small,
  },
  smallTopMargin: {
    marginTop: theme.spacings.xSmall,
  },
}));
