import TravelPlanning from '@atb/assets/svg/color/images/light/TravelPlanning';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {useTranslation} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {MobileTokenWithoutTravelcardOnboardingScreenProps} from './navigation_types';
import {SafeAreaView} from 'react-native-safe-area-context';
import MobileTokenWithoutTravelcardOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenWithoutTravelcardOnboarding';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type FlexibilityInfoProps =
  MobileTokenWithoutTravelcardOnboardingScreenProps<'MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen'>;

export const MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen = ({
  navigation,
}: FlexibilityInfoProps): JSX.Element => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerContent}>
        <View style={styles.viewContent}>
          <View style={styles.mainView}>
            <View accessible={true} ref={focusRef}>
              <ThemeText
                type="heading--jumbo"
                style={styles.header}
                color={themeColor}
              >
                {t(
                  MobileTokenWithoutTravelcardOnboardingTexts.flexibilityInfo
                    .heading,
                )}
              </ThemeText>
            </View>
            <View style={styles.illustration}>
              <TravelPlanning />
            </View>
            <ThemeText color={themeColor} style={styles.description}>
              {t(
                MobileTokenWithoutTravelcardOnboardingTexts.flexibilityInfo
                  .description,
              )}
            </ThemeText>
          </View>
          <View style={styles.buttons}>
            <Button
              interactiveColor="interactive_0"
              onPress={() => {
                navigation.navigate(
                  'MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen',
                );
              }}
              text={t(MobileTokenWithoutTravelcardOnboardingTexts.next)}
              testID="nextButton"
              accessibilityHint={t(
                MobileTokenWithoutTravelcardOnboardingTexts.a11yNextPageHint,
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
    paddingHorizontal: theme.spacings.xLarge,
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
  cardOrPhoneIllustration: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cardOrPhoneText: {
    marginTop: theme.spacings.xLarge,
    marginHorizontal: theme.spacings.xLarge,
  },
  description: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
  buttons: {
    marginVertical: theme.spacings.medium,
  },
}));
