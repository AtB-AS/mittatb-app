import React from 'react';
import {Map} from '@atb/components/map';
import {MapScreenProps} from '@atb/screens/Map/index';
import {Place, Quay} from '@atb/api/types/departures';

export const MapScreen = ({navigation}: MapScreenProps<'MapScreen'>) => {
  const navigateToQuay = (place: Place, quay: Quay) => {
    navigation.navigate('PlaceScreen', {place, selectedQuay: quay});
  };

  return <Map selectionMode={'ExploreStops'} navigateToQuay={navigateToQuay} />;
};
