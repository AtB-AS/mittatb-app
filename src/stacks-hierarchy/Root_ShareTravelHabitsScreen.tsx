import {
  ShareTravelHabitsTexts,
  useTranslation,
  getTextForLanguage,
} from '@atb/translations';
import React, {useEffect} from 'react';

import {RootStackScreenProps} from './navigation-types';
import {Linking} from 'react-native';
import {Beacons} from '@atb/assets/svg/color/images';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {
  PermissionType,
  checkAndRequestPermission,
} from '@atb/utils/permissions';
import {useHasSeenShareTravelHabitsScreen} from '@atb/beacons/use-has-seen-share-travel-habits-screen';
import {OnboardingScreen} from '@atb/onboarding-screen';

export type SearchStopPlaceProps =
  RootStackScreenProps<'Root_ShareTravelHabitsScreen'>;

export const Root_ShareTravelHabitsScreen = ({
  navigation,
}: SearchStopPlaceProps) => {
  const {t, language} = useTranslation();

  const {configurableLinks} = useFirestoreConfiguration();

  const [_, setAndStoreHasSeenShareTravelHabitsScreen] =
    useHasSeenShareTravelHabitsScreen();
  useEffect(() => {
    setAndStoreHasSeenShareTravelHabitsScreen(true);
  }, [setAndStoreHasSeenShareTravelHabitsScreen]);

  const choosePermissions = async () => {
    const bluetoothPermissionGranted = await checkAndRequestPermission(
      PermissionType.Bluetooth,
    );
    if (bluetoothPermissionGranted) {
      const locationAlwaysAllowPermissionGranted =
        await checkAndRequestPermission(PermissionType.LocationAlwaysAllow);
      if (locationAlwaysAllowPermissionGranted) {
        await checkAndRequestPermission(
          PermissionType.MotionAndFitnessActivity,
        );
      }
    }
    navigation.goBack();
  };

  return (
    <OnboardingScreen
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
