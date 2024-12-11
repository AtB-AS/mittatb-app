import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {type FareContract, isNormalTravelRight} from '@atb/ticketing';
import {
  findReferenceDataById,
  getReferenceDataName,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {useTranslation} from '@atb/translations';
import {useTheme} from '@atb/theme';

type Props = {
  fc: FareContract;
  testID?: string;
};

export const ProductName = ({fc, testID}: Props) => {
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const {language} = useTranslation();
  const {theme} = useTheme();

  const travelRight = fc.travelRights[0];
  if (!isNormalTravelRight(travelRight)) return null;
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
      color={theme.color.foreground.dark.secondary}
    >
      {productName}
    </ThemeText>
  );
};
