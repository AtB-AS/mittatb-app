import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import pa from './termsInformation.json';
import Info from './Information';

export default function TermsInformation() {
  const {t, language} = useTranslation();
  const data = pa[language];
  return (
    <Info informations={data} title={t(InformationTexts.terms.title)}></Info>
  );
}
