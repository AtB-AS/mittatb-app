import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ticketingInfo from '../../../../assets/information-data/ticketingInformation.json';

import Information, {InformationElement} from './Information';

export default function TicketingInformation() {
  const {t, language} = useTranslation();

  const data = ticketingInfo[language];

  return (
    <Information
      informations={data as InformationElement[]}
      title={t(InformationTexts.ticketing.title)}
    ></Information>
  );
}
