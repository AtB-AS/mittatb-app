import {MessageBox, MessageBoxProps} from '@atb/components/message-box';
import React from 'react';
import {getMessageTypeForSituation, getSituationSummary} from './utils';
import {useTranslation} from '@atb/translations';
import {SituationType} from '@atb/situations/types';

export type Props = {
  situation: SituationType;
  noStatusIcon?: MessageBoxProps['noStatusIcon'];
  style?: MessageBoxProps['style'];
};

export const SituationMessageBox = ({
  situation,
  noStatusIcon,
  style,
}: Props) => {
  const {language} = useTranslation();

  const messageType = getMessageTypeForSituation(situation);
  const text = getSituationSummary(situation, language);

  if (!text) return null;

  return (
    <MessageBox
      type={messageType}
      noStatusIcon={noStatusIcon}
      style={style}
      message={text}
    />
  );
};
