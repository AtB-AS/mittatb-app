import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {type FareContractType} from '@atb-as/utils';
import {
  findReferenceDataById,
  getReferenceDataName,
} from '@atb/modules/configuration';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';

type Props = {
  fc: FareContractType;
};

export const ProductName = ({fc}: Props) => {
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {language} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const travelRight = fc.travelRights[0];
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    travelRight.fareProductRef,
  );
  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;
  return (
    <ThemeText
      typography="body__secondary--bold"
      accessibilityLabel={productName + screenReaderPause}
      testID="productName"
      color={theme.color.foreground.dynamic.secondary}
      style={styles.text}
    >
      {productName}
    </ThemeText>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  text: {
    textAlign: 'center',
  },
}));
