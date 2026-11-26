import {StyleSheet, Theme} from '@atb/theme';
import React from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? undefined : 'padding'}
      style={containerStyle}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View style={containerStyle}>{children}</View>
  );
}

const useStyles = StyleSheet.createThemeHook(
  (theme: Theme, {bottom, left, right}) => {
    return {
      container: {
        paddingBottom: bottom + theme.spacing.medium,
        paddingLeft: theme.spacing.medium + left,
        paddingRight: theme.spacing.medium + right,
      },
    };
  },
);
