import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';

const themeColor = 'background_accent_0';

export const LoadingScreen = React.memo(() => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={t(dictionary.loading)}
      testID="loadingScreen"
    >
      <ActivityIndicator
        size="large"
        color={styles.activityIndicator.backgroundColor}
      />
      <ThemeText
        style={styles.loadingText}
        type="body__primary"
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
    backgroundColor: theme.static.background[themeColor].background,
  },
  loadingText: {textAlign: 'center', marginTop: theme.spacings.medium},
  activityIndicator: {
    backgroundColor: theme.static.status.info.background,
  },
}));
