import {useTranslation} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import TravelDocumentOnboardingTexts from '@atb/translations/screens/subscreens/TravelDocumentOnboarding';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import Button from '@atb/components/button';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {flatStaticColors, StaticColorByType} from '@atb/theme/colors';
import {ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {usePreferenceItems} from '@atb/preferences';
import {settingToRouteName} from '@atb/utils/navigation';
import {TravelDeviceTitle} from '@atb/travel-token-box';
import {TravelToken} from '@atb/mobile-token/types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

TCardAsTravelDocument.navigationOptions = {
  gesturesEnabled: false,
};

export function TCardAsTravelDocument({
  inspectableToken,
}: {
  inspectableToken: TravelToken;
}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {themeName} = useTheme();
  const {startScreen} = usePreferenceItems();
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
            {t(TravelDocumentOnboardingTexts.tCard.heading)}
          </ThemeText>
        </View>
        <View
          style={[
            styles.travelDocumentContainer,
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
              {t(TravelDocumentOnboardingTexts.tCard.reminder)}
            </ThemeText>
          </View>
        </View>
        <ThemeText
          style={styles.description}
          color={themeColor}
          isMarkdown={true}
        >
          {t(TravelDocumentOnboardingTexts.tCard.description)}
        </ThemeText>
      </View>

      <View style={styles.bottomView}>
        <FullScreenFooter>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate(settingToRouteName(startScreen));
            }}
            text={t(TravelDocumentOnboardingTexts.ok)}
            testID="nextButton"
            style={styles.nextButton}
          />
          <Button
            interactiveColor="interactive_1"
            mode="secondary"
            onPress={() => {
              navigation.navigate('SelectTravelToken');
            }}
            text={t(TravelDocumentOnboardingTexts.tCard.button)}
            testID="switchButton"
          />
        </FullScreenFooter>
      </View>
    </View>
  );
}
const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
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
  travelDocumentContainer: {
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
