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
import {formatNumberToString, SearchOfferPrice} from '@atb-as/utils';

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
            <PricePerTraveller
              key={u.id}
              userProfileWithCountAndOffer={u}
              style={i != 0 ? styles.smallTopMargin : undefined}
            />
          ))}
          {baggageProductsWithCountAndOffer.map((sp, i) => (
            <PricePerTraveller
              key={sp.id}
              baggageProductWithCountAndOffer={sp}
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

type PricePerTravellerProps = {style: StyleProp<ViewStyle>} & (
  | {
      userProfileWithCountAndOffer: UserProfileWithCountAndOffer;
      baggageProductWithCountAndOffer?: undefined;
    }
  | {
      userProfileWithCountAndOffer?: undefined;
      baggageProductWithCountAndOffer: BaggageProductWithCountAndOffer;
    }
);

const PricePerTraveller = ({style, ...props}: PricePerTravellerProps) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  let searchOfferPrice: SearchOfferPrice | undefined = undefined;
  let travellerData:
    | UserProfileWithCountAndOffer
    | BaggageProductWithCountAndOffer
    | undefined = undefined;

  let count = 0;
  if (props.userProfileWithCountAndOffer) {
    travellerData = props.userProfileWithCountAndOffer;
    count = travellerData.count;
    searchOfferPrice = travellerData.offer.price;
  } else {
    travellerData = props.baggageProductWithCountAndOffer;
    count = travellerData.count;
    searchOfferPrice = travellerData.offer.supplementProducts[0].price;
  }

  const price = count * (searchOfferPrice.amountFloat || 0);
  const originalPrice = count * (searchOfferPrice.originalAmountFloat || 0);

  const priceString = formatNumberToString(price, language);
  const originalPriceString = originalPrice
    ? formatNumberToString(originalPrice, language)
    : undefined;

  const hasFlexDiscount = price < originalPrice;

  const travellerName = getReferenceDataName(travellerData, language);
  const a11yLabel = [
    `${count} ${travellerName}`,
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
      style={[style, styles.travellerItem]}
    >
      <ThemeText
        style={styles.travellerCountAndName}
        color="secondary"
        typography="body__s"
        testID="travellerCountAndName"
      >
        {count} {travellerName}
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
  smallTopMargin: {
    marginTop: theme.spacing.xSmall,
  },
}));
