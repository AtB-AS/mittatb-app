import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {type FareContract, isNormalTravelRight} from '@atb/ticketing';
import {
  findReferenceDataById,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useTheme} from '@atb/theme';

type Props = {
  fc: FareContract;
  testID?: string;
};

export const Description = ({fc, testID}: Props) => {
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const {language} = useTranslation();
  const {theme} = useTheme();

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
      color={theme.color.foreground.dark.secondary}
    >
      {description}
    </ThemeText>
  );
};
