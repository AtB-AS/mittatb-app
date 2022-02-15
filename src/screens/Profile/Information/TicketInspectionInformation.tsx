import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ticketInspectionInfo from '../../../reference-data/ticketInspectionInformation.json';
import Info, {InformationElement} from './Information';
export default function TicketInspectionInformation() {
  const {t, language} = useTranslation();

  const data = ticketInspectionInfo[language];

  return (
    <Info
      informations={data as InformationElement[]}
      title={t(InformationTexts.inspection.title)}
    ></Info>
  );
}
