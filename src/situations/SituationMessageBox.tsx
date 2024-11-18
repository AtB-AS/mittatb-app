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
  a11yAnnounce?: boolean;
};

export const SituationMessageBox = ({
  situation,
  noStatusIcon,
  style,
  a11yAnnounce,
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
      a11yAnnounce={a11yAnnounce}
      onPressConfig={{
        text: t(dictionary.readMore),
        action: () => openSituation(situation),
      }}
    />
  );
};
