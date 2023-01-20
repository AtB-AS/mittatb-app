import {Onboarding2} from '@atb/assets/svg/color/images';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useFinishOnboarding} from '@atb/stacks-hierarchy/Root_OnboardingStack/use-finish-onboarding';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {OnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {OnboardingScreenProps} from './navigation-types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type IntercomInfoScreenProps =
  OnboardingScreenProps<'Onboarding_IntercomInfoScreen'>;

export const Onboarding_IntercomInfoScreen = ({
  navigation,
}: IntercomInfoScreenProps) => {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {width: windowWidth} = useWindowDimensions();
  const finishOnboarding = useFinishOnboarding();
  const {enable_ticketing} = useRemoteConfig();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainView}>
        <ThemeText
          type={'body__primary--jumbo--bold'}
          color={themeColor}
          style={styles.header}
        >
          {t(OnboardingTexts.intercom.title)}
        </ThemeText>
        <Onboarding2 width={windowWidth} height={windowWidth * (4 / 5)} />
        <ThemeText style={styles.description} color={themeColor}>
          {t(OnboardingTexts.intercom.description)}
        </ThemeText>
      </View>
      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_0"
          onPress={() =>
            enable_ticketing
              ? navigation.navigate(
                  'Onboarding_AnonymousPurchaseConsequencesScreen',
                )
              : finishOnboarding()
          }
          text={t(OnboardingTexts.intercom.mainButton)}
          testID="nextButton"
        />
      </View>
    </ScrollView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
    paddingTop: theme.spacings.xLarge,
  },
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    paddingTop: theme.spacings.xLarge,
  },
  mainView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
}));
