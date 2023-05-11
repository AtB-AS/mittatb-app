import {MobileTokenWithoutTravelcardOnboardingScreenProps} from './navigation_types';
import {useTranslation} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemedTokenPhone} from '@atb/theme/ThemedAssets';
import {Button} from '@atb/components/button';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import MobileTokenWithoutTravelcardOnboardingTexts from '@atb/translations/screens/subscreens/MobileTokenWithoutTravelcardOnboarding';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type OptionsInfoScreenProps =
  MobileTokenWithoutTravelcardOnboardingScreenProps<'MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen'>;

export const MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen = ({
  navigation,
}: OptionsInfoScreenProps): JSX.Element => {
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
                  MobileTokenWithoutTravelcardOnboardingTexts.optionsInfo
                    .heading,
                )}
              </ThemeText>
            </View>

            <View style={styles.illustration}>
              <View style={styles.cardOrPhoneIllustration}>
                <ThemedTokenPhone />
              </View>
            </View>
            <ThemeText color={themeColor} style={styles.description}>
              {t(
                MobileTokenWithoutTravelcardOnboardingTexts.optionsInfo
                  .description,
              )}
            </ThemeText>
          </View>

          <View style={styles.buttons}>
            <Button
              interactiveColor="interactive_0"
              onPress={() => {
                navigation.navigate(
                  'MobileTokenWithoutTravelcardOnboarding_TicketSafetyInfoScreen',
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
