import {screenReaderPause} from '@atb/components/accessible-text';
import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemedMapImage} from '@atb/theme/ThemedAssets';
import {MapTexts, useTranslation} from '@atb/translations';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import StatusBarOnFocus from '@atb/components/status-bar-on-focus';

export function MapDisabledForScreenReader() {
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const focusRef = useFocusOnLoad();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBarOnFocus
        barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
      />
      <ThemedMapImage />
      <View
        ref={focusRef}
        accessible={true}
        accessibilityLabel={
          t(MapTexts.disabledForScreenReader.title) +
          screenReaderPause +
          t(MapTexts.disabledForScreenReader.description)
        }
      >
        <ThemeText type="body__primary--bold" style={styles.header}>
          {t(MapTexts.disabledForScreenReader.title)}
        </ThemeText>
        <ThemeText style={styles.description}>
          {t(MapTexts.disabledForScreenReader.description)}
        </ThemeText>
      </View>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_0.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginVertical: theme.spacings.medium,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
}));
