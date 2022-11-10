import {Place} from '@atb/api/types/departures';
import {Location} from '@atb/favorites/types';
import {useOnlySingleLocation} from '@atb/location-search';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React from 'react';
import {DeparturesStackProps} from './types';
import {NearbyStopPlaces} from '@atb/screens/Departures/components/NearbyStopPlaces';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import FullScreenHeader from '@atb/components/screen-header/full-header';

export type DeparturesScreenParams = {
  location: Location;
};

type RootProps = DeparturesStackProps<'DeparturesScreen'>;

export const DeparturesScreen = ({navigation}: RootProps) => {
  const fromLocation = useOnlySingleLocation<RootProps['route']>('location');
  const {t} = useTranslation();

  const navigateToPlace = (place: Place) => {
    navigation.navigate('PlaceScreen', {
      place,
      mode: 'Departure',
    });
  };
  const {leftButton} = useServiceDisruptionSheet();

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
