import {StopPlace} from '@atb/api/types/departures';
import {Location} from '@atb/favorites/types';
import {useOnlySingleLocation} from '@atb/location-search';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useEffect} from 'react';
import {DeparturesStackProps} from './types';
import {NearbyStopPlaces} from '@atb/screens/Departures/components/NearbyStopPlaces';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useShouldShowDeparturesOnboarding} from '@atb/screens/Departures/use-should-show-departures-onboarding';

export type DeparturesScreenParams = {
  location: Location;
};

type RootProps = DeparturesStackProps<'DeparturesScreen'>;

export const DeparturesScreen = ({navigation}: RootProps) => {
  const fromLocation = useOnlySingleLocation<RootProps['route']>('location');
  const {t} = useTranslation();

  const navigateToPlace = (place: StopPlace) => {
    navigation.navigate('PlaceScreen', {
      place,
      mode: 'Departure',
    });
  };
  const {leftButton} = useServiceDisruptionSheet();

  const shouldShowDeparturesOnboarding = useShouldShowDeparturesOnboarding();
  useEffect(() => {
    if (shouldShowDeparturesOnboarding) {
      navigation.navigate('DeparturesOnboardingScreen');
    }
  }, [shouldShowDeparturesOnboarding]);

  return (
    <>
      <FullScreenHeader
        title={t(DeparturesTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={leftButton}
        globalMessageContext="app-departures"
      />
      <NearbyStopPlaces
        navigation={navigation}
        fromLocation={fromLocation}
        callerRouteName={'DeparturesScreen'}
        onSelect={navigateToPlace}
        mode={'Departure'}
      />
    </>
  );
};
