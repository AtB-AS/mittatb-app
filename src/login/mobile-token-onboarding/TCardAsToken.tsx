import {useTranslation} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import MobileTokenOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import Button from '@atb/components/button';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {flatStaticColors, StaticColorByType} from '@atb/theme/colors';
import {ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {usePreferenceItems} from '@atb/preferences';
import {settingToRouteName} from '@atb/utils/navigation';
import {TravelDeviceTitle} from '@atb/travel-token-box';
import {RemoteToken} from '@atb/mobile-token/types';
import {useAppState} from '@atb/AppContext';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function TCardAsToken({
  inspectableToken,
}: {
  inspectableToken: RemoteToken;
}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {themeName} = useTheme();
  const {startScreen} = usePreferenceItems();
  const {completeMobileTokenOnboarding} = useAppState();
  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View>
          <ThemeText
            type="body__primary--jumbo"
            style={[styles.alignCenter, styles.marginVertical]}
            color={themeColor}
            isMarkdown={true}
          >
            {t(MobileTokenOnboardingTexts.tCard.heading)}
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
            <ThemedTokenTravelCard />
            <ThemeText color={themeColor} style={styles.reminderText}>
              {t(MobileTokenOnboardingTexts.tCard.reminder)}
            </ThemeText>
          </View>
        </View>
        <ThemeText
          style={styles.description}
          color={themeColor}
          isMarkdown={true}
        >
          {t(MobileTokenOnboardingTexts.tCard.description)}
        </ThemeText>
      </View>

      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_0"
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
          text={t(MobileTokenOnboardingTexts.tCard.button)}
          testID="switchButton"
        />
      </View>
    </View>
  );
}
const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.xLarge,
  },
  alignCenter: {
    textAlign: 'center',
  },
  mainView: {
    marginTop: 164,
    height: 430,
  },
  marginVertical: {
    marginTop: 44,
  },
  cardNo: {
    flexDirection: 'row',
  },
  description: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: theme.spacings.medium,
  },
  flex: {
    flexDirection: 'row',
    width: 327,
  },
  reminderText: {
    marginLeft: theme.spacings.medium,
    marginTop: theme.spacings.medium,
    marginRight: 160,
  },
  mobileTokenContainer: {
    backgroundColor: theme.static.background.background_accent_2.background,
    height: 178,
    marginVertical: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    padding: 24,
  },
  bottomView: {
    marginTop: 35.5,
  },
  nextButton: {
    marginBottom: theme.spacings.medium,
  },
}));
