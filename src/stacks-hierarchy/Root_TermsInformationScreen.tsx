import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import termsInfo from '@atb/assets/information-data/termsInformation.json';
import {
  InformationElement,
  InformationScreenComponent,
} from '@atb/information-screen';

export const Root_TermsInformationScreen = () => {
  const {t, language} = useTranslation();
  const data = termsInfo[language];
  return (
    <InformationScreenComponent
      information={data as InformationElement[]}
      title={t(InformationTexts.terms.title)}
      leftButton={{type: 'close'}}
    />
  );
};
