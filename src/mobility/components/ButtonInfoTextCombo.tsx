import {Button} from '@atb/components/button';
import {MessageInfoText} from '@atb/components/message-info-text';
import {StyleSheet, useThemeContext} from '@atb/theme';
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
  const styles = useStyles();
  const {theme} = useThemeContext();
  return (
    <>
      <MessageInfoText
        type="warning"
        message={message}
        style={styles.warning}
      />
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

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    warning: {
      paddingBottom: theme.spacing.medium,
    },
  };
});
