import MessageBox, {MessageBoxProps} from '@atb/components/message-box';
import {useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import React from 'react';
import {getUniqueSituations, filterSituations} from './utils';
import {useTranslation} from '@atb/translations';
import {SituationType} from '@atb/situations/types';

export type Props = {
  situations?: SituationType[];
  noStatusIcon?: MessageBoxProps['noStatusIcon'];
  containerStyle?: MessageBoxProps['containerStyle'];
};

export const SituationMessagesBox = ({
  situations,
  noStatusIcon,
  containerStyle,
}: Props) => {
  const {theme} = useTheme();
  const {language} = useTranslation();
  if (!filterSituations(situations)?.length) {
    return null;
  }

  const uniqueSituations = getUniqueSituations(situations, language);
  return (
    <MessageBox
      type="warning"
      noStatusIcon={noStatusIcon}
      containerStyle={containerStyle}
    >
      {Object.entries(uniqueSituations).map(([id, situation]) => (
        <ThemeText key={id} style={{color: theme.static.status.warning.text}}>
          {situation}
        </ThemeText>
      ))}
    </MessageBox>
  );
};
