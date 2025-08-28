import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {type FareContractType} from '@atb-as/utils';
import {findReferenceDataById} from '@atb/modules/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';

type Props = {
  fc: FareContractType;
};

export const Description = ({fc}: Props) => {
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {language} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const travelRight = fc.travelRights[0];
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
      color={theme.color.foreground.dynamic.secondary}
      style={styles.text}
    >
      {description}
    </ThemeText>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  text: {
    textAlign: 'center',
  },
}));
