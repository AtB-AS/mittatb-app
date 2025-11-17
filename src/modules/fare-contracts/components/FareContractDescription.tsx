import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {FareContractInfo} from '../use-fare-contract-info';

type Props = {
  fc: FareContractInfo;
};

export const Description = ({fc}: Props) => {
  const {language} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const mostSignificantTicket = fc.mostSignificantTicket;
  const description = mostSignificantTicket
    ? getTextForLanguage(mostSignificantTicket.description, language)
    : undefined;
  if (!description) return null;
  return (
    <ThemeText
      typography="body__s"
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
