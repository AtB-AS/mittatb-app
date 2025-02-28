import React, {useCallback} from 'react';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {OnboardingScreenComponent} from '@atb/onboarding';
import {MyLocation} from '@atb/assets/svg/color/images';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';

export type LocationScreenComponentProps = {};

export const LocationScreenComponent = ({}: LocationScreenComponentProps) => {
  const {t} = useTranslation();

  const {requestLocationPermission} = useGeolocationContext();

  return (
    <OnboardingScreenComponent
      illustration={<MyLocation height={220} />}
      title={t(MobilityTexts.shmoRequirements.location.title)}
      description={t(MobilityTexts.shmoRequirements.location.description)}
      buttonText={t(MobilityTexts.shmoRequirements.location.button)}
      buttonOnPress={requestLocationPermission}
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    />
  );
};
