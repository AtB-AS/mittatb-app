import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {getReferenceDataName} from '@atb/modules/configuration';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {FareContractInfo} from '../use-fare-contract-info';

type Props = {
  fc: FareContractInfo;
};

export const ProductName = ({fc}: Props) => {
  const {language} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const nameInfo = fc.mostSignificantTicket;
  const productName = getReferenceDataName(nameInfo, language);
  return (
    <ThemeText
      typography="body__s__strong"
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
