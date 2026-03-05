import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {Loading} from '@atb/components/loading';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const LoadingScreen = React.memo(() => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={t(dictionary.loading)}
      testID="loadingScreen"
    >
      <Loading size="small" color={styles.loading.backgroundColor} />
      <ThemeText
        style={styles.loadingText}
        typography="body__m"
        color={themeColor}
        testID="loadingScreenText"
      >
        {t(dictionary.loading)}
      </ThemeText>
    </View>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: getThemeColor(theme).background,
  },
  loadingText: {textAlign: 'center', marginTop: theme.spacing.medium},
  loading: {
    backgroundColor: getThemeColor(theme).foreground.primary,
  },
}));
