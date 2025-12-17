import {screenReaderPause} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {ThemedMapImage} from '@atb/theme/ThemedAssets';
import {MapTexts, useTranslation} from '@atb/translations';
import {Ref} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  focusRef: Ref<any>;
};

export const MapDisabledForScreenReader = ({focusRef}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
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
        <ThemeText typography="body__m__strong" style={styles.header}>
          {t(MapTexts.disabledForScreenReader.title)}
        </ThemeText>
        <ThemeText style={styles.description}>
          {t(MapTexts.disabledForScreenReader.description)}
        </ThemeText>
      </View>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[0].background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginVertical: theme.spacing.medium,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
}));
