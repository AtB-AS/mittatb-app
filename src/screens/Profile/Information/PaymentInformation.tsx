import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import pa from './paymentInformation.json';
import Info from './Information';
export default function PaymentInformation() {
  const {t, language} = useTranslation();
  const data = pa[language];

  return (
    <Info informations={data} title={t(InformationTexts.payment.title)}></Info>
  );
}
