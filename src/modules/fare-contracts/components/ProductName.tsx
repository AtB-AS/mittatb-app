import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {type FareContractType} from '@atb-as/utils';
import {
  findReferenceDataById,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';

type Props = {
  fc: FareContractType;
  testID?: string;
};

export const ProductName = ({fc, testID}: Props) => {
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
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
      testID={testID + 'Product'}
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
