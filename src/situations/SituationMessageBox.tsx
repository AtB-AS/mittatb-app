import {
  MessageInfoBox,
  MessageInfoBoxProps,
} from '@atb/components/message-info-box';
import React from 'react';
import {getMessageTypeForSituation, getSituationSummary} from './utils';
import {dictionary, useTranslation} from '@atb/translations';
import {SituationType} from './types';
import {useSituationBottomSheet} from './use-situation-bottom-sheet';

export type Props = {
  situation: SituationType;
  noStatusIcon?: MessageInfoBoxProps['noStatusIcon'];
  style?: MessageInfoBoxProps['style'];
};

export const SituationMessageBox = ({
  situation,
  noStatusIcon,
  style,
}: Props) => {
  const {language} = useTranslation();

  const messageType = getMessageTypeForSituation(situation);
  const text = getSituationSummary(situation, language);
  const {t} = useTranslation();
  const {openSituation} = useSituationBottomSheet();

  if (!text) return null;

  return (
    <MessageInfoBox
      type={messageType}
      noStatusIcon={noStatusIcon}
      style={style}
      message={text}
      onPressConfig={{
        text: t(dictionary.readMore),
        action: () => openSituation(situation),
      }}
    />
  );
};
