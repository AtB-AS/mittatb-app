import {
  ShareTravelHabitsTexts,
  useTranslation,
  getTextForLanguage,
} from '@atb/translations';
import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Beacons} from '@atb/assets/svg/color/images';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {OnboardingScreenComponent} from '@atb/onboarding-screen';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';
import {useOnboardingNavigationFlow} from '@atb/utils/use-onboarding-navigation-flow';
import {useAnalytics} from '@atb/analytics';
import {checkPermissionStatuses} from '@atb/beacons/permissions';
import {useFocusEffect} from '@react-navigation/native';

export const Root_ShareTravelHabitsScreen = () => {
  const {t, language} = useTranslation();

  const {configurableLinks} = useFirestoreConfiguration();

  const {continueFromOnboardingScreen} = useOnboardingNavigationFlow();

  const {onboardForBeacons} = useBeaconsState();

  const analytics = useAnalytics();

  // call useFocusEffect to send analytics once when the screen is shown
  useFocusEffect(
    useCallback(() => {
      analytics.logEvent('Onboarding', 'didSeeShareTravelHabitsScreen');
    }, [analytics]),
  );

  const choosePermissions = async () => {
    await onboardForBeacons(false);

    const permissions = await checkPermissionStatuses(); // get given permissions status
    analytics.logEvent('Onboarding', 'beaconsPermissionAnswers', {
      bluetooth: permissions.bluetooth,
      locationAlways: permissions.locationAlways,
      motion: permissions.motion,
    });

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
