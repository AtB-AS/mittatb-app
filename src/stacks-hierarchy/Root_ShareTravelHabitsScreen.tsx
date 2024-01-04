import {
  ShareTravelHabitsTexts,
  useTranslation,
  getTextForLanguage,
} from '@atb/translations';
import React from 'react';

import {Linking} from 'react-native';
import {Beacons} from '@atb/assets/svg/color/images';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {OnboardingScreenComponent} from '@atb/onboarding-screen';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';
import {useOnboardingNavigationFlow} from '@atb/utils/use-onboarding-navigation-flow';
import {useAppState} from '@atb/AppContext';

export const Root_ShareTravelHabitsScreen = () => {
  const {t, language} = useTranslation();

  const {configurableLinks} = useFirestoreConfiguration();

  const {continueFromOnboardingScreen} = useOnboardingNavigationFlow();

  const {completeShareTravelHabitsOnboarding} = useAppState();

  const {onboardForBeacons} = useBeaconsState();

  const choosePermissions = async () => {
    await onboardForBeacons();
    completeShareTravelHabitsOnboarding();
    continueFromOnboardingScreen('Root_ShareTravelHabitsScreen');
  };

  return (
    <OnboardingScreenComponent
      illustration={<Beacons height={132} />}
      title={t(ShareTravelHabitsTexts.title)}
      description={
        t(ShareTravelHabitsTexts.description.improvement) +
        '\n\n' +
        t(ShareTravelHabitsTexts.description.safety)
      }
      descriptionLink={{
        text: t(ShareTravelHabitsTexts.readMoreAboutDataSharing),
        a11yHint: t(ShareTravelHabitsTexts.readMoreAboutDataSharingA11yHint),
        onPress: () => {
          const dataSharingInfoUrl = getTextForLanguage(
            configurableLinks?.dataSharingInfo,
            language,
          );
          dataSharingInfoUrl && Linking.openURL(dataSharingInfoUrl);
        },
      }}
      footerDescription={t(ShareTravelHabitsTexts.bluetoothInfo)}
      buttonText={t(ShareTravelHabitsTexts.choosePermissions)}
      buttonOnPress={choosePermissions}
      testID="shareTravelHabits"
    />
  );
};
