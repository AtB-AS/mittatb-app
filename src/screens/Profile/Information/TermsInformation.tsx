import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import pa from './termsInformation.json';
import Info from './Information';

export default function TermsInformation() {
  const {t, language} = useTranslation();
  const data = pa[language];
  return (
    <Info informations={data} title={t(InformationTexts.terms.title)}></Info>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  content: {
    padding: theme.spacings.medium,
  },
  paragraphHeading: {
    marginVertical: theme.spacings.medium,
  },
  bullet: {
    marginTop: theme.spacings.medium,
  },
  link: {
    marginTop: theme.spacings.medium,
  },
}));
