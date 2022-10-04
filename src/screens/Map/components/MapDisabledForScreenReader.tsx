import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Map as MapImage} from '@atb/assets/svg/color/images';
import {MapTexts, useTranslation} from '@atb/translations';

export function MapDisabledForScreenReader() {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <MapImage style={styles.illustration} />
      <ThemeText type="body__primary--bold" style={styles.header}>
        {t(MapTexts.disabledForScreenReader.title)}
      </ThemeText>
      <ThemeText>{t(MapTexts.disabledForScreenReader.description)}</ThemeText>
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
    marginBottom: theme.spacings.medium,
  },
  illustration: {
    marginBottom: theme.spacings.medium,
  },
}));
