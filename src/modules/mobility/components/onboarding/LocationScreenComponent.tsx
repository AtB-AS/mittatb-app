import React from 'react';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {ThemedMyLocation} from '@atb/theme/ThemedAssets';

export type LocationScreenComponentProps = {};

export const LocationScreenComponent = ({}: LocationScreenComponentProps) => {
  const {t} = useTranslation();

  const {requestLocationPermission} = useGeolocationContext();

  return (
    <OnboardingScreenComponent
      illustration={<ThemedMyLocation height={220} />}
      title={t(MobilityTexts.shmoRequirements.location.title)}
      description={t(MobilityTexts.shmoRequirements.location.description)}
      footerButton={{
        onPress: () => requestLocationPermission(false),
        text: t(MobilityTexts.shmoRequirements.location.button),
        expanded: false,
      }}
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    />
  );
};
