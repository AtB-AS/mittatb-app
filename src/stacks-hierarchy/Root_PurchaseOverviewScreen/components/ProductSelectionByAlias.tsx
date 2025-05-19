import React from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {InteractiveColor} from '@atb/theme/colors';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {
  isProductSellableInApp,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {ProductAliasChip} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ProductAliasChip';
import {useTicketingContext} from '@atb/modules/ticketing';
import {ContentHeading} from '@atb/components/heading';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';

type Props = {
  color: InteractiveColor;
  selection: PurchaseSelectionType;
  setSelection: (s: PurchaseSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelectionByAlias({
  color,
  selection,
  setSelection,
  style,
}: Props) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const {customerProfile} = useTicketingContext();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const selectableProducts = preassignedFareProducts
    .filter((product) => isProductSellableInApp(product, customerProfile))
    .filter((product) => product.type === selection.preassignedFareProduct.type)
    .filter(onlyUniquesBasedOnField('productAliasId', true));

  const title = useTextForLanguage(
    selection.fareProductTypeConfig.configuration.productSelectionTitle,
  );

  return (
    <View style={style}>
      <ContentHeading
        text={title || t(PurchaseOverviewTexts.productSelection.title)}
      />
      <ScrollView
        style={styles.durationScrollView}
        contentContainerStyle={styles.durationContentContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        testID="selectDurationScrollView"
      >
        {selectableProducts.map((fp, i) => {
          const text = getTextForLanguage(fp.productAlias, language);
          if (!text) return null;

          return (
            <ProductAliasChip
              color={color}
              text={text}
              selected={
                selection.preassignedFareProduct.productAliasId
                  ? selection.preassignedFareProduct.productAliasId ===
                    fp.productAliasId
                  : selection.preassignedFareProduct.id === fp.id
              }
              onPress={() => {
                const newSelection = selectionBuilder
                  .fromSelection(selection)
                  .product(fp)
                  .build();
                setSelection(newSelection);
              }}
              key={i}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  durationScrollView: {
    marginLeft: -theme.spacing.medium,
    marginRight: -theme.spacing.medium,
  },
  durationContentContainer: {
    flexDirection: 'row',
    marginLeft: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
  },
}));
