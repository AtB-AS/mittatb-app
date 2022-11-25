import MessageBox, {MessageBoxProps} from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import React from 'react';
import {getMessageTypeForSituation, getSituationSummary} from './utils';
import {useTranslation} from '@atb/translations';
import {SituationType} from '@atb/situations/types';

export type Props = {
  situation: SituationType;
  mode?: 'no-icon' | 'icon';
  style?: MessageBoxProps['containerStyle'];
};

export const SituationMessageBox = ({situation, mode, style}: Props) => {
  const {language} = useTranslation();

  const messageType = getMessageTypeForSituation(situation);
  const text = getSituationSummary(situation, language);

  const icon = mode === 'no-icon' ? null : undefined;
  return (
    <MessageBox type={messageType} icon={icon} containerStyle={style}>
      <ThemeText color={messageType}>{text}</ThemeText>
    </MessageBox>
  );
};
