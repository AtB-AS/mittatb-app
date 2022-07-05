import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import Button from '@atb/components/button';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {flatStaticColors, StaticColorByType} from '@atb/theme/colors';
import {ThemedTokenPhone} from '@atb/theme/ThemedAssets';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {settingToRouteName} from '@atb/utils/navigation';
import {usePreferenceItems} from '@atb/preferences';
import {TravelDeviceTitle} from '@atb/travel-token-box';
import {RemoteToken} from '@atb/mobile-token/types';
import {useAppState} from '@atb/AppContext';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {MobileTokenTabParams} from '@atb/screens/MobileTokenOnboarding/index';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function MobileAsTokenScreen({
  inspectableToken,
  navigation,
}: {
  inspectableToken: RemoteToken;
  navigation: MaterialTopTabNavigationProp<MobileTokenTabParams>;
}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const focusRef = useFocusOnLoad();
  const {startScreen} = usePreferenceItems();
  const {completeMobileTokenOnboarding} = useAppState();
  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View accessible={true} ref={focusRef}>
          <ThemeText
            type="heading--jumbo"
            style={[styles.header, styles.marginVertical]}
            color={themeColor}
            isMarkdown={true}
          >
            {t(MobileTokenOnboardingTexts.phone.heading)}
          </ThemeText>
        </View>
        <View
          style={[
            styles.mobileTokenContainer,
            {
              backgroundColor:
                flatStaticColors[themeName]['background_accent_3'].background,
            },
          ]}
        >
          <TravelDeviceTitle inspectableToken={inspectableToken} />
          <View style={styles.flex}>
            <ThemedTokenPhone />
            <ThemeText color={themeColor} style={styles.reminderText}>
              {t(MobileTokenOnboardingTexts.phone.reminder)}
            </ThemeText>
          </View>
        </View>
        <ThemeText
          style={styles.description}
          color={themeColor}
          isMarkdown={true}
        >
          {t(MobileTokenOnboardingTexts.phone.description)}
        </ThemeText>
      </View>
      <Button
        onPress={() => {
          completeMobileTokenOnboarding();
          navigation.navigate(settingToRouteName(startScreen));
        }}
        text={t(MobileTokenOnboardingTexts.ok)}
        testID="nextButton"
        style={styles.nextButton}
      />
      <Button
        interactiveColor="interactive_1"
        mode="secondary"
        onPress={() => {
          navigation.navigate('SelectTravelToken');
        }}
        text={t(MobileTokenOnboardingTexts.phone.button)}
        testID="switchButton"
      />
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.xLarge,
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
  mainView: {
    marginTop: '30%',
    marginBottom: '25%',
  },
  header: {
    textAlign: 'center',
    alignSelf: 'center',
    width: '85%',
  },
  marginVertical: {
    marginTop: 44,
  },
  description: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: theme.spacings.medium,
  },
  flex: {
    flexDirection: 'row',
  },
  reminderText: {
    marginHorizontal: theme.spacings.medium,
    marginTop: theme.spacings.large,
    marginRight: 80,
  },
  mobileTokenContainer: {
    backgroundColor: theme.static.background.background_accent_2.background,
    marginVertical: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    padding: 28,
  },
  phoneInfoBox: {
    marginVertical: theme.spacings.xLarge,
    alignSelf: 'center',
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.circle,
    minHeight: 300,
    minWidth: 200,
  },
  phoneLine: {
    width: theme.spacings.xLarge * 2,
    borderRadius: theme.border.radius.regular,
    height: theme.spacings.small,
    alignSelf: 'center',
    marginTop: theme.spacings.small,
    marginBottom: theme.spacings.small + theme.spacings.xLarge,
  },
  phoneInfoBoxInner: {
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.large,
    alignSelf: 'center',
  },
  nextButton: {
    marginBottom: theme.spacings.medium,
  },
}));
