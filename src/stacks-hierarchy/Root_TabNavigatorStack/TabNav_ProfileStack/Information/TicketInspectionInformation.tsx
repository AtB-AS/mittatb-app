import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ticketInspectionInfo from '../../../../assets/information-data/ticketInspectionInformation.json';

import Information, {InformationElement} from './Information';
export default function TicketInspectionInformation() {
  const {t, language} = useTranslation();

  const data = ticketInspectionInfo[language];

  return (
    <Information
      informations={data as InformationElement[]}
      title={t(InformationTexts.inspection.title)}
    ></Information>
  );
}
