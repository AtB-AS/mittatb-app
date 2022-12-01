import MessageBox, {MessageBoxProps} from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import React from 'react';
import {getMessageTypeForSituation, getSituationSummary} from './utils';
import {useTranslation} from '@atb/translations';
import {SituationType} from '@atb/situations/types';

export type Props = {
  situation: SituationType;
  noStatusIcon?: MessageBoxProps['noStatusIcon'];
  style?: MessageBoxProps['containerStyle'];
};

export const SituationMessageBox = ({
  situation,
  noStatusIcon,
  style,
}: Props) => {
  const {language} = useTranslation();

  const messageType = getMessageTypeForSituation(situation);
  const text = getSituationSummary(situation, language);

  return (
    <MessageBox
      type={messageType}
      noStatusIcon={noStatusIcon}
      containerStyle={style}
    >
      <ThemeText color={messageType}>{text}</ThemeText>
    </MessageBox>
  );
};
