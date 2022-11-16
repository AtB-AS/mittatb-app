import {Situation as Situation_v1} from '@atb/sdk';
import {Situation as Situation_from_Trips} from '@atb/api/types/trips';
import MessageBox, {MessageBoxProps} from '@atb/components/message-box';
import {useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import React from 'react';
import {getUniqueSituations, hasSituations} from './utils';
import {useTranslation} from '@atb/translations';

export type Props = {
  situations: Situation_v1[] | Situation_from_Trips[];
  mode?: 'no-icon' | 'icon';
  containerStyle?: MessageBoxProps['containerStyle'];
};

export const SituationMessagesBox = ({
  situations,
  mode,
  containerStyle,
}: Props) => {
  const {theme} = useTheme();
  const {language} = useTranslation();
  if (!hasSituations(situations)) {
    return null;
  }

  const uniqueSituations = getUniqueSituations(situations, language);
  const icon = mode === 'no-icon' ? null : undefined;
  return (
    <MessageBox type="warning" icon={icon} containerStyle={containerStyle}>
      {Object.entries(uniqueSituations).map(([id, situation]) => (
        <ThemeText key={id} style={{color: theme.static.status.warning.text}}>
          {situation}
        </ThemeText>
      ))}
    </MessageBox>
  );
};
