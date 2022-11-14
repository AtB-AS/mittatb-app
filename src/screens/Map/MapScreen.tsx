import React from 'react';
import {Map} from '@atb/components/map';
import {MapScreenProps} from '@atb/screens/Map/index';
import {StopPlace, Quay} from '@atb/api/types/departures';
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import StatusBarOnFocus from '@atb/components/status-bar-on-focus';
import {NavigateToTripSearchCallback as TravelFromAndToLocationsCallback} from '@atb/components/map/types';

export const MapScreen = ({navigation}: MapScreenProps<'MapScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;
  const navigateToQuay = (place: StopPlace, quay: Quay) => {
    navigation.navigate('PlaceScreen', {
      place,
      selectedQuay: quay,
      mode: 'Departure',
    });
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
      activeItemIndex: 0,
    });
  };
  const navigateToTripSearch: TravelFromAndToLocationsCallback = (
    location,
    destination,
  ) => {
    navigation.navigate({
      name: 'TripSearch',
      params: {
        [destination]: location,
      },
      merge: true,
    });
  };

  return (
    <>
      <StatusBarOnFocus barStyle="dark-content" />
      <Map
        selectionMode={'ExploreStops'}
        navigateToQuay={navigateToQuay}
        navigateToDetails={navigateToDetails}
        navigateToTripSearch={navigateToTripSearch}
      />
    </>
  );
};
