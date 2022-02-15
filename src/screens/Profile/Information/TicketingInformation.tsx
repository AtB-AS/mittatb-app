import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ticketingInfo from '../../../reference-data/ticketingInformation.json';
import Info, {InformationElement} from './Information';

export default function TicketingInformation() {
  const {t, language} = useTranslation();

  const data = ticketingInfo[language];

  return (
    <Info
      informations={data as InformationElement[]}
      title={t(InformationTexts.ticketing.title)}
    ></Info>
  );
}
