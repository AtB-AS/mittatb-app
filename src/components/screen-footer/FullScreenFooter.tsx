import {StyleSheet, Theme} from '@atb/theme';
import React from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ScreenFooterProps = {
  children: React.ReactNode;
  avoidKeyboard?: boolean;
};

export function FullScreenFooter({children, avoidKeyboard}: ScreenFooterProps) {
  const styles = useStyles();

  return avoidKeyboard ? (
    <KeyboardAvoidingView behavior="padding" style={styles.view}>
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View style={styles.view}>{children}</View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    view: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      paddingHorizontal: theme.spacings.medium,
    },
  };
});
