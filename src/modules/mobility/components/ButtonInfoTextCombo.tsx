import {Button} from '@atb/components/button';
import {MessageInfoText} from '@atb/components/message-info-text';
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
  return (
    <>
      <MessageInfoText type="warning" message={message} />
      <Button
        surfaceColor="accent"
        mode="primary"
        expanded={true}
        type="large"
        accessibilityRole="button"
        onPress={onPress}
        text={buttonText}
      />
    </>
  );
};
