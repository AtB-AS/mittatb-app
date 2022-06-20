import {useTranslation} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import Button from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {StaticColorByType} from '@atb/theme/colors';
import {CrashSmall} from '@atb/assets/svg/color/images';
import {settingToRouteName} from '@atb/utils/navigation';
import {usePreferenceItems} from '@atb/preferences';
import {useAppState} from '@atb/AppContext';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function NoMobileToken({}: {}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {completeMobileTokenOnboarding} = useAppState();
  const {startScreen} = usePreferenceItems();

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <ThemeText
          type="body__primary--jumbo--bold"
          style={styles.alignCenter}
          color={themeColor}
        >
          {t(MobileTokenOnboardingTexts.error.heading)}
        </ThemeText>
      </View>
      <View style={styles.svgContainer}>
        <CrashSmall width="185px" height="185px" />
      </View>
      <ThemeText style={styles.description} color={themeColor}>
        {t(MobileTokenOnboardingTexts.error.description)}
      </ThemeText>
      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_0"
          onPress={() => {
            completeMobileTokenOnboarding();
            navigation.navigate(settingToRouteName(startScreen));
          }}
          text={t(MobileTokenOnboardingTexts.next)}
          testID="nextButton"
        />
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  svgContainer: {
    marginTop: 46,
    marginLeft: 95,
  },
  container: {
    paddingHorizontal: theme.spacings.xLarge,
  },
  alignCenter: {
    textAlign: 'center',
  },
  topView: {
    marginTop: 100,
  },
  description: {
    marginTop: 34,
    textAlign: 'center',
  },
  bottomView: {
    marginTop: 34,
  },
}));
