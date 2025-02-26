import React, {useCallback} from 'react';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {OnboardingScreenComponent} from '@atb/onboarding';
import {MyLocation} from '@atb/assets/svg/color/images';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';

export type LocationBlockerProps = {};

export const LocationBlocker = ({}: LocationBlockerProps) => {
  const {t} = useTranslation();

  const {requestLocationPermission} = useGeolocationContext();

  const setCurrentLocationOrRequest = useCallback(async () => {
    await requestLocationPermission();
  }, [requestLocationPermission]);

  return (
    <OnboardingScreenComponent
      illustration={<MyLocation height={220} />}
      title={t(MobilityTexts.shmoRequirements.location.locationTitle)}
      description={t(
        MobilityTexts.shmoRequirements.location.locationDescription,
      )}
      buttonText={t(MobilityTexts.shmoRequirements.location.locationButton)}
      buttonOnPress={setCurrentLocationOrRequest}
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    />
  );
};
