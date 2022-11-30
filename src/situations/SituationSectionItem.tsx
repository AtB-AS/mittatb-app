import React from 'react';
import {useTranslation} from '@atb/translations';
import {MessageItem} from '@atb/components/sections';
import {
  getMessageTypeForSituation,
  getSituationSummary,
} from '@atb/situations/utils';
import {SituationType} from '@atb/situations/types';

type Props = {
  situation: SituationType;
};

export const SituationSectionItem = ({situation}: Props) => {
  const {language} = useTranslation();
  const situationText = getSituationSummary(situation, language);

  if (!situationText) return null;

  return (
    <MessageItem
      messageType={getMessageTypeForSituation(situation)}
      message={situationText}
    />
  );
};
