import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {
  FareProductTypeConfig,
  getReferenceDataName,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {StyleSheet, useTheme} from '@atb/theme';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import React from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {UserProfileWithCountAndOffer} from '../../Root_PurchaseOverviewScreen/use-offer-state';

type Props = {
  fareProductTypeConfig: FareProductTypeConfig;
  isSearchingOffer: boolean;
  userProfilesWithCountAndOffer: UserProfileWithCountAndOffer[];
  totalPrice: number;
};

export const PriceSummary = ({
  fareProductTypeConfig,
  isSearchingOffer,
  userProfilesWithCountAndOffer,
  totalPrice,
}: Props) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const {vatPercent} = useFirestoreConfiguration();

  const vatAmount = totalPrice - totalPrice / (1 + vatPercent / 100);
  const vatAmountString = formatDecimalNumber(vatAmount, language);
  const vatPercentString = formatDecimalNumber(vatPercent, language);
  const totalPriceString = formatDecimalNumber(totalPrice, language, 2);

  const {travellerSelectionMode} = fareProductTypeConfig.configuration;

  return (
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
            <ThemeText typography="body__primary">
              {t(PurchaseConfirmationTexts.totalCost.title)}
            </ThemeText>
            <ThemeText typography="body__tertiary" color="secondary">
              {t(
                PurchaseConfirmationTexts.totalCost.label(
                  vatPercentString,
                  vatAmountString,
                ),
              )}
            </ThemeText>
          </View>

          {!isSearchingOffer ? (
            <ThemeText typography="body__primary--jumbo" testID="totalPrice">
              {totalPriceString} kr
            </ThemeText>
          ) : (
            <ActivityIndicator
              size={theme.spacing.medium}
              color={theme.color.foreground.dynamic.primary}
              style={{margin: theme.spacing.medium}}
            />
          )}
        </View>
      </GenericSectionItem>
    </Section>
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
        typography="body__secondary"
        testID="userProfileCountAndName"
      >
        {count} {userProfileName}
      </ThemeText>
      <View style={styles.userProfilePrice}>
        {hasFlexDiscount && (
          <ThemeText
            typography="body__tertiary"
            color="secondary"
            style={styles.userProfileOriginalPriceAmount}
          >
            {originalPriceString} kr
          </ThemeText>
        )}
        <ThemeText color="secondary" typography="body__secondary">
          {priceString} kr
        </ThemeText>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  userProfileItem: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userProfileCountAndName: {marginRight: theme.spacing.small},
  userProfilePrice: {flexDirection: 'row', flexWrap: 'wrap'},
  userProfileOriginalPriceAmount: {
    marginEnd: theme.spacing.small,
    alignSelf: 'flex-end',
    textDecorationLine: 'line-through',
  },
  paymentSummaryContainer: {
    marginVertical: theme.spacing.medium,
  },
  totalPaymentContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  totalContainerHeadings: {
    paddingVertical: theme.spacing.xSmall,
  },
  smallTopMargin: {
    marginTop: theme.spacing.xSmall,
  },
}));
