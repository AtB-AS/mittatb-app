import {
  MessageInfoBox,
  MessageInfoBoxProps,
} from '@atb/components/message-info-box';
import React from 'react';
import {getMessageTypeForSituation, getSituationSummary} from './utils';
import {dictionary, useTranslation} from '@atb/translations';
import {SituationType} from './types';
import {useSituationBottomSheet} from './use-situation-bottom-sheet';
import type {A11yLiveRegion} from '@atb/components/screen-reader-announcement';

export type Props = {
  situation: SituationType;
  noStatusIcon?: MessageInfoBoxProps['noStatusIcon'];
  style?: MessageInfoBoxProps['style'];
  a11yLiveRegion?: A11yLiveRegion;
};

export const SituationMessageBox = ({
  situation,
  noStatusIcon,
  style,
  a11yLiveRegion,
}: Props) => {
  const {language} = useTranslation();
  const onCloseFocusRef = React.useRef(null);

  const messageType = getMessageTypeForSituation(situation);
  const text = getSituationSummary(situation, language);
  const {t} = useTranslation();
  const {openSituation} = useSituationBottomSheet({onCloseFocusRef});

  if (!text) return null;

  return (
    <MessageInfoBox
      type={messageType}
      noStatusIcon={noStatusIcon}
      style={style}
      message={text}
      a11yLiveRegion={a11yLiveRegion}
      onPressConfig={{
        text: t(dictionary.readMore),
        action: () => openSituation(situation),
      }}
      focusRef={onCloseFocusRef}
    />
  );
};
