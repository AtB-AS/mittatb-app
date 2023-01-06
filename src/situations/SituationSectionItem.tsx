import React from 'react';
import {dictionary, useTranslation} from '@atb/translations';
import {MessageSectionItem} from '@atb/components/sections';
import {getMessageTypeForSituation, getSituationSummary} from './utils';
import {SituationType} from './types';
import {useSituationBottomSheet} from './use-situation-bottom-sheet';

type Props = {
  situation: SituationType;
};

export const SituationSectionItem = ({situation}: Props) => {
  const {t, language} = useTranslation();
  const situationText = getSituationSummary(situation, language);
  const {openSituation} = useSituationBottomSheet();

  if (!situationText) return null;

  return (
    <MessageSectionItem
      messageType={getMessageTypeForSituation(situation)}
      message={situationText}
      onPressConfig={{
        text: t(dictionary.readMore),
        action: () => openSituation(situation),
      }}
    />
  );
};
