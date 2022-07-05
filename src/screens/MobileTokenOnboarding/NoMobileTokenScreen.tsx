import {useTranslation} from '@atb/translations';
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
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {MobileTokenTabParams} from '@atb/screens/MobileTokenOnboarding';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function NoMobileTokenScreen({
  navigation,
}: {
  navigation: MaterialTopTabNavigationProp<MobileTokenTabParams>;
}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {completeMobileTokenOnboarding} = useAppState();
  const {startScreen} = usePreferenceItems();

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <ThemeText
          type="heading--jumbo"
          style={styles.header}
          color={themeColor}
        >
          {t(MobileTokenOnboardingTexts.error.heading)}
        </ThemeText>
        <View style={styles.svgContainer}>
          <CrashSmall width="185px" height="185px" />
        </View>
        <ThemeText style={styles.description} color={themeColor}>
          {t(MobileTokenOnboardingTexts.error.description)}
        </ThemeText>
      </View>
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
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  svgContainer: {
    marginTop: 46,
    marginLeft: 95,
  },
  container: {
    paddingHorizontal: theme.spacings.xLarge,
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {
    height: '70%',
    marginTop: '30%',
    marginBottom: '15%',
    flex: 1.5,
  },
  header: {
    width: '80%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  description: {
    marginTop: 34,
    textAlign: 'center',
  },
}));
