import React from 'react';
import {useTranslation} from '@atb/translations';
import {MessageItem} from '@atb/components/sections';
import {getSituationText} from '@atb/situations/utils';
import {SituationType} from '@atb/situations/types';

export type Props = {
  situation: SituationType;
};

export const SituationSectionItem = ({situation}: Props) => {
  const {language} = useTranslation();
  const situationText = getSituationText(situation, language);

  if (!situationText) return null;

  return (
    <MessageItem
      messageType={getMessageType(situation)}
      message={situationText}
    />
  );
};

const getMessageType = (situation: Props['situation']) => {
  if ('reportType' in situation) {
    return situation.reportType === 'incident' ? 'warning' : 'info';
  }
  return 'warning';
};
