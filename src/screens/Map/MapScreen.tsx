import React from 'react';
import {Map} from '@atb/components/map';
import {MapScreenProps} from '@atb/screens/Map/index';
import {Place, Quay} from '@atb/api/types/departures';

export const MapScreen = ({navigation}: MapScreenProps<'MapScreen'>) => {
  const navigateToQuay = (place: Place, quay: Quay) => {
    navigation.navigate('PlaceScreen', {place, selectedQuay: quay});
  };
  const navigateToDetails = (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => {
    if (!serviceJourneyId || !date) return;
    navigation.navigate('DepartureDetails', {
      items: [
        {
          serviceJourneyId,
          serviceDate,
          date,
          fromQuayId,
          isTripCancelled,
        },
      ],
    });
  };

  return (
    <Map
      selectionMode={'ExploreStops'}
      navigateToQuay={navigateToQuay}
      navigateToDetails={navigateToDetails}
    />
  );
};
