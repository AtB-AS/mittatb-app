import MessageBox, {MessageBoxProps} from '@atb/components/message-box';
import {useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import React from 'react';
import {getUniqueSituations, hasSituations} from './utils';
import {useTranslation} from '@atb/translations';
import {SituationsType} from '@atb/situations/types';

export type Props = {
  situations: SituationsType;
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
