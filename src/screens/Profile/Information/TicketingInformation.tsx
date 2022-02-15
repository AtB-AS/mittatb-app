import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ticketingInfo from './ticketingInformation.json';
import Info from './Information';

export default function TicketingInformation() {
  const {t, language} = useTranslation();

  const data = ticketingInfo[language];

  return (
    <Info
      informations={data}
      title={t(InformationTexts.ticketing.title)}
    ></Info>
  );
}
