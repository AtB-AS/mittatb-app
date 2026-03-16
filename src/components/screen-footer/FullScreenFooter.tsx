import {StyleSheet, Theme} from '@atb/theme';
import React from 'react';
import {KeyboardAvoidingView, View} from 'react-native';

type ScreenFooterProps = {
  children: React.ReactNode;
  avoidKeyboard?: boolean;
  footerColor?: string;
};

export function FullScreenFooter({
  children,
  avoidKeyboard,
  footerColor,
}: ScreenFooterProps) {
  const styles = useStyles();
  const containerStyle = {...styles.container, backgroundColor: footerColor};

  return avoidKeyboard ? (
    <KeyboardAvoidingView behavior="padding" style={containerStyle}>
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View style={containerStyle}>{children}</View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme, {bottom}) => {
  return {
    container: {
      paddingBottom: bottom + theme.spacing.medium,
      paddingHorizontal: theme.spacing.medium,
    },
  };
});
