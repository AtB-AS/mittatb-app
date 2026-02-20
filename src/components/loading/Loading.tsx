import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext, Theme} from '@atb/theme';

const getThemeColor = (theme: Theme) => theme.color.background.accent[3];

export const Loading: React.FC<{text?: string}> = ({text}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);

  return (
    <View style={styles.container}>
      <View
        animating={true}
        size="large"
        color={themeColor.foreground.primary}
      />
      {text ? (
        <ThemeText typography="body__m__strong" style={styles.text}>
          {text}
        </ThemeText>
      ) : null}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
  },
}));
