import {InformationTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ticketInspectionInfo from './ticketInspectionInformation.json';
import Info from './Information';
export default function TicketInspectionInformation() {
  const {t, language} = useTranslation();

  const data = ticketInspectionInfo[language];
  const mapped = data.map((item) => {
    if (item.type === 'link' && item.link && item.text) {
      return {type: item.type, link: item.link, text: item.text};
    }
    if (item.type === 'text') {
      return {text: item.text};
    }
  });
  return (
    <Info
      informations={data}
      title={t(InformationTexts.inspection.title)}
    ></Info>
  );
}
