import {useTranslation} from '@atb/translations';
import {ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {StaticColorByType} from '@atb/theme/colors';
import {CrashSmall} from '@atb/assets/svg/color/images';
import {useAppState} from '@atb/AppContext';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function NoMobileTokenScreen({close}: {close: () => void}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {completeMobileTokenOnboarding} = useAppState();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
    >
      <View style={styles.viewContent}>
        <View style={styles.mainView}>
          <ThemeText
            type="heading--jumbo"
            style={styles.header}
            color={themeColor}
          >
            {t(MobileTokenOnboardingTexts.error.heading)}
          </ThemeText>
          <View style={styles.illustration}>
            <CrashSmall width="185px" height="185px" />
          </View>
          <ThemeText style={styles.description} color={themeColor}>
            {t(MobileTokenOnboardingTexts.error.description)}
          </ThemeText>
        </View>
        <View style={styles.buttons}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              completeMobileTokenOnboarding();
              close();
            }}
            text={t(MobileTokenOnboardingTexts.next)}
            testID="nextButton"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.xLarge,
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  containerContent: {
    paddingTop: theme.spacings.xLarge,
    flexGrow: 1,
  },
  viewContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainView: {
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: theme.spacings.xLarge,
    textAlign: 'center',
  },
  illustration: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacings.xLarge,
  },
  description: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
  buttons: {
    marginVertical: theme.spacings.medium,
  },
}));
