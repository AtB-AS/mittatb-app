import {StopPlace} from '@atb/api/types/departures';
import {Location} from '@atb/favorites/types';
import {useOnlySingleLocation} from '@atb/location-search';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useEffect} from 'react';
import {DeparturesStackProps} from './navigation-types';
import {NearbyStopPlaces} from '../../../nearby-stop-places/NearbyStopPlaces';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useShouldShowDeparturesOnboarding} from './use-should-show-departures-onboarding';

export type DeparturesScreenParams = {
  location: Location;
};

type Props = DeparturesStackProps<'Departures_NearbyStopPlacesScreen'>;

export const Departures_NearbyStopPlacesScreen = ({navigation}: Props) => {
  const fromLocation = useOnlySingleLocation<Props['route']>('location');
  const {t} = useTranslation();

  const navigateToPlace = (place: StopPlace) => {
    navigation.navigate('Departures_PlaceScreen', {
      place,
      mode: 'Departure',
    });
  };
  const {leftButton} = useServiceDisruptionSheet();

  const shouldShowDeparturesOnboarding = useShouldShowDeparturesOnboarding();
  useEffect(() => {
    if (shouldShowDeparturesOnboarding) {
      navigation.navigate('Departures_OnboardingScreen');
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
        callerRouteName={'Departures_NearbyStopPlacesScreen'}
        onSelect={navigateToPlace}
        mode={'Departure'}
      />
    </>
  );
};
