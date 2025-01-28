import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {type FareContract} from '@atb/ticketing';
import {
  findReferenceDataById,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {useTranslation} from '@atb/translations';
import {useThemeContext} from '@atb/theme';

type Props = {
  fc: FareContract;
  testID?: string;
};

export const ProductName = ({fc, testID}: Props) => {
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const {language} = useTranslation();
  const {theme} = useThemeContext();

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
    >
      {productName}
    </ThemeText>
  );
};
