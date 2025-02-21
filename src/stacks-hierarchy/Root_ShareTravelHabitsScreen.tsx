import {
  ShareTravelHabitsTexts,
  useTranslation,
  getTextForLanguage,
} from '@atb/translations';
import React from 'react';
import {Linking} from 'react-native';
import {Beacons} from '@atb/assets/svg/color/images';
import {useFirestoreConfigurationContext} from '@atb/configuration/FirestoreConfigurationContext';
import {
  OnboardingScreenComponent,
  useOnboardingNavigation,
} from '@atb/onboarding';
import {useBeaconsContext} from '@atb/beacons/BeaconsContext';
import {useAnalyticsContext} from '@atb/analytics';
import {checkPermissionStatuses} from '@atb/beacons/permissions';

export const Root_ShareTravelHabitsScreen = () => {
  const {t, language} = useTranslation();

  const {configurableLinks} = useFirestoreConfigurationContext();

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  const {onboardForBeacons} = useBeaconsContext();

  const analytics = useAnalyticsContext();

  const choosePermissions = async () => {
    await onboardForBeacons(false);

    const permissions = await checkPermissionStatuses(); // get given permissions status
    analytics.logEvent('Onboarding', 'beaconsPermissionAnswers', {
      bluetooth: permissions.bluetooth,
      locationAlways: permissions.locationAlways,
      motion: permissions.motion,
    });

    continueFromOnboardingSection('shareTravelHabits');
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
