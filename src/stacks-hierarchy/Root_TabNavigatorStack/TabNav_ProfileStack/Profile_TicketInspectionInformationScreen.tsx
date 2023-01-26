import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ticketInspectionInfo from '@atb/assets/information-data/ticketInspectionInformation.json';
import {
  InformationElement,
  InformationScreenComponent,
} from '@atb/information-screen';

export const Profile_TicketInspectionInformationScreen = () => {
  const {t, language} = useTranslation();

  const data = ticketInspectionInfo[language];

  return (
    <InformationScreenComponent
      informations={data as InformationElement[]}
      title={t(InformationTexts.inspection.title)}
    />
  );
};
