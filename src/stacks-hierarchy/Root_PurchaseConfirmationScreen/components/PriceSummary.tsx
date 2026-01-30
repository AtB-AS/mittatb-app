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
import {ActivityIndicator, View} from 'react-native';
import {
  type SupplementProductWithCountAndOffer,
  UserProfileWithCountAndOffer,
} from '../../Root_PurchaseOverviewScreen/use-offer-state';
import {formatNumberToString, SearchOfferPrice} from '@atb-as/utils';

type Props = {
  fareProductTypeConfig: FareProductTypeConfig;
  isSearchingOffer: boolean;
  userProfilesWithCountAndOffer: UserProfileWithCountAndOffer[];
  supplementProductsWithCountAndOffer: SupplementProductWithCountAndOffer[];
  totalPrice: number;
};

export const PriceSummary = ({
  fareProductTypeConfig,
  isSearchingOffer,
  userProfilesWithCountAndOffer,
  supplementProductsWithCountAndOffer,
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
        <GenericSectionItem style={styles.travellerList}>
          {userProfilesWithCountAndOffer.map((u) => (
            <PricePerTraveller
              key={u.id}
              name={getReferenceDataName(u, language)}
              offerPrice={u.offer.price}
              count={u.count}
            />
          ))}
          {supplementProductsWithCountAndOffer.map((sp) => (
            <PricePerTraveller
              key={sp.id}
              name={getReferenceDataName(sp, language)}
              offerPrice={sp.offer.supplementProducts[0].price}
              count={sp.count}
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

type PricePerTravellerProps = {
  name: string;
  offerPrice: SearchOfferPrice;
  count: number;
};

const PricePerTraveller = ({
  name,
  offerPrice,
  count,
}: PricePerTravellerProps) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const price = count * (offerPrice.amountFloat || 0);
  const originalPrice = count * (offerPrice.originalAmountFloat || 0);

  const priceString = formatNumberToString(price, language);
  const originalPriceString = originalPrice
    ? formatNumberToString(originalPrice, language)
    : undefined;

  const hasFlexDiscount = price < originalPrice;

  const a11yLabel = [
    `${count} ${name}`,
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
      style={styles.travellerItem}
    >
      <ThemeText
        style={styles.travellerCountAndName}
        color="secondary"
        typography="body__s"
        testID="travellerCountAndName"
      >
        {count} {name}
      </ThemeText>
      <View style={styles.travellerPrice}>
        {hasFlexDiscount && (
          <ThemeText
            typography="body__xs"
            color="secondary"
            style={styles.travellerOriginalPriceAmount}
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
  travellerList: {
    gap: theme.spacing.xSmall,
  },
  travellerItem: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  travellerCountAndName: {marginRight: theme.spacing.small},
  travellerPrice: {flexDirection: 'row', flexWrap: 'wrap'},
  travellerOriginalPriceAmount: {
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
}));
