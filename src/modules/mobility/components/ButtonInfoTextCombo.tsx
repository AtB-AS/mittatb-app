import {Button} from '@atb/components/button';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useThemeContext} from '@atb/theme';
import React from 'react';

interface ButtonInfoTextComboProps {
  message: string;
  buttonText: string;
  onPress: () => void;
}

export const ButtonInfoTextCombo = ({
  message,
  buttonText,
  onPress,
}: ButtonInfoTextComboProps) => {
  const {theme} = useThemeContext();
  return (
    <>
      <MessageInfoText type="warning" message={message} />
      <Button
        mode="primary"
        active={false}
        interactiveColor={theme.color.interactive[0]}
        expanded={true}
        type="large"
        accessibilityRole="button"
        onPress={onPress}
        text={buttonText}
      />
    </>
  );
};
