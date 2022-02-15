import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import paymentInfo from '../../../reference-data/paymentInformation.json';
import Info, {InformationElement} from './Information';
export default function PaymentInformation() {
  const {t, language} = useTranslation();
  const data = paymentInfo[language];

  return (
    <Info
      informations={data as InformationElement[]}
      title={t(InformationTexts.payment.title)}
    ></Info>
  );
}
