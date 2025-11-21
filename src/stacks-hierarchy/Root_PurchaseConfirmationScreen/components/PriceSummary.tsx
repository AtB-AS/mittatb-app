import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {
  FareProductTypeConfig,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {
  BaggageProductWithCountAndOffer,
  UserProfileWithCountAndOffer,
} from '../../Root_PurchaseOverviewScreen/use-offer-state';
import {formatNumberToString} from '@atb-as/utils';

type Props = {
  fareProductTypeConfig: FareProductTypeConfig;
  isSearchingOffer: boolean;
  userProfilesWithCountAndOffer: UserProfileWithCountAndOffer[];
  baggageProductsWithCountAndOffer: BaggageProductWithCountAndOffer[];
  totalPrice: number;
};

export const PriceSummary = ({
  fareProductTypeConfig,
  isSearchingOffer,
  userProfilesWithCountAndOffer,
  baggageProductsWithCountAndOffer,
  totalPrice,
}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const {vatPercent} = useFirestoreConfigurationContext();

  const vatAmount = totalPrice - totalPrice / (1 + vatPercent / 100);
  const vatAmountString = formatNumberToString(vatAmount, language, 2);
  const vatPercentString = formatNumberToString(vatPercent, language);
  const totalPriceString = formatNumberToString(totalPrice, language);

  const {travellerSelectionMode} = fareProductTypeConfig.configuration;

  return (
    <Section>
      {travellerSelectionMode !== 'none' && (
        <GenericSectionItem>
          {userProfilesWithCountAndOffer.map((u, i) => (
            <PricePerUserProfile
              key={u.id}
              userProfile={u}
              style={i != 0 ? styles.smallTopMargin : undefined}
            />
          ))}
          {baggageProductsWithCountAndOffer.map((sp, i) => (
            <PricePerBaggageProduct
              key={sp.id}
              baggageProduct={sp}
              style={i != 0 ? styles.smallTopMargin : undefined}
            />
          ))}
        </GenericSectionItem>
      )}
      <GenericSectionItem>
        <View style={styles.totalPaymentContainer} accessible={true}>
          <View style={styles.totalContainerHeadings}>
            <ThemeText typography="body__m">
              {t(PurchaseConfirmationTexts.totalCost.title)}
            </ThemeText>
            <ThemeText typography="body__xs" color="secondary">
              {t(
                PurchaseConfirmationTexts.totalCost.label(
                  vatPercentString,
                  vatAmountString,
                ),
              )}
            </ThemeText>
          </View>

          {!isSearchingOffer ? (
            <ThemeText typography="heading__xl" testID="totalPrice">
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

  const price = count * (offer.price.amountFloat || 0);
  const originalPrice = count * (offer.price.originalAmountFloat || 0);

  const priceString = formatNumberToString(price, language);
  const originalPriceString = originalPrice
    ? formatNumberToString(originalPrice, language)
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
        typography="body__s"
        testID="userProfileCountAndName"
      >
        {count} {userProfileName}
      </ThemeText>
      <View style={styles.userProfilePrice}>
        {hasFlexDiscount && (
          <ThemeText
            typography="body__xs"
            color="secondary"
            style={styles.userProfileOriginalPriceAmount}
          >
            {originalPriceString} kr
          </ThemeText>
        )}
        <ThemeText color="secondary" typography="body__s">
          {priceString} kr
        </ThemeText>
      </View>
    </View>
  );
};

const PricePerBaggageProduct = ({
  baggageProduct,
  style,
}: {
  baggageProduct: BaggageProductWithCountAndOffer;
  style: StyleProp<ViewStyle>;
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {count, offer} = baggageProduct;

  const price = count * (offer.supplementProducts[0].price.amountFloat || 0);
  const originalPrice =
    count * (offer.supplementProducts[0].price.originalAmountFloat || 0);

  const priceString = formatNumberToString(price, language);
  const originalPriceString = originalPrice
    ? formatNumberToString(originalPrice, language)
    : undefined;

  const hasFlexDiscount = price < originalPrice;

  const baggageProductName = getReferenceDataName(baggageProduct, language);
  const a11yLabel = [
    `${count} ${baggageProductName}`,
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
        typography="body__s"
        testID="baggageProductCountAndName"
      >
        {count} {baggageProductName}
      </ThemeText>
      <View style={styles.userProfilePrice}>
        {hasFlexDiscount && (
          <ThemeText
            typography="body__xs"
            color="secondary"
            style={styles.userProfileOriginalPriceAmount}
          >
            {originalPriceString} kr
          </ThemeText>
        )}
        <ThemeText color="secondary" typography="body__s">
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
