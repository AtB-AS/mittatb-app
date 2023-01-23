import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import termsInfo from '../../../../assets/information-data/termsInformation.json';

import Information, {InformationElement} from './Information';

export default function TermsInformation() {
  const {t, language} = useTranslation();
  const data = termsInfo[language];
  return (
    <Information
      informations={data as InformationElement[]}
      title={t(InformationTexts.terms.title)}
    ></Information>
  );
}
