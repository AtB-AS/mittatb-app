import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {type FareContract, isNormalTravelRight} from '@atb/ticketing';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useThemeContext} from '@atb/theme';

type Props = {
  fc: FareContract;
  testID?: string;
};

export const Description = ({fc, testID}: Props) => {
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const {language} = useTranslation();
  const {theme} = useThemeContext();

  const travelRight = fc.travelRights[0];
  if (!isNormalTravelRight(travelRight)) return null;
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    travelRight.fareProductRef,
  );
  const description = preassignedFareProduct
    ? getTextForLanguage(preassignedFareProduct.description, language)
    : undefined;
  if (!description) return null;
  return (
    <ThemeText
      typography="body__secondary"
      accessibilityLabel={description + screenReaderPause}
      testID={testID + 'Product'}
      color={theme.color.foreground.dynamic.secondary}
    >
      {description}
    </ThemeText>
  );
};
