import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ticketingInfo from '@atb/assets/information-data/ticketingInformation.json';
import {
  InformationElement,
  InformationScreenComponent,
} from '@atb/information-screen';

export const Profile_TicketingInformationScreen = () => {
  const {t, language} = useTranslation();

  const data = ticketingInfo[language];

  return (
    <InformationScreenComponent
      informations={data as InformationElement[]}
      title={t(InformationTexts.ticketing.title)}
    />
  );
};
