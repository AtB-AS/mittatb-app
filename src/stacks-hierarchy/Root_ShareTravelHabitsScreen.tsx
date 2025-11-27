import {
  ShareTravelHabitsTexts,
  useTranslation,
  getTextForLanguage,
} from '@atb/translations';
import React from 'react';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {
  OnboardingScreenComponent,
  useOnboardingNavigation,
} from '@atb/modules/onboarding';
import {useBeaconsContext, checkPermissionStatuses} from '@atb/modules/beacons';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {ThemedBeacons} from '@atb/theme/ThemedAssets';
import {openInAppBrowser} from '@atb/modules/in-app-browser';

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
      illustration={<ThemedBeacons height={171} />}
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
          dataSharingInfoUrl && openInAppBrowser(dataSharingInfoUrl, 'close');
        },
      }}
      footerDescription={t(ShareTravelHabitsTexts.bluetoothInfo)}
      footerButton={{
        text: t(ShareTravelHabitsTexts.choosePermissions),
        onPress: choosePermissions,
        expanded: true,
      }}
      testID="shareTravelHabits"
    />
  );
};
