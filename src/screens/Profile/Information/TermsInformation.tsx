import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import termsInfo from '../../../reference-data/termsInformation.json';
import Info, {InformationElement} from './Information';

export default function TermsInformation() {
  const {t, language} = useTranslation();
  const data = termsInfo[language];
  return (
    <Info
      informations={data as InformationElement[]}
      title={t(InformationTexts.terms.title)}
    ></Info>
  );
}
