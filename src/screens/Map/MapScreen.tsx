import React from 'react';
import {Map} from '@atb/components/map';
import {MapScreenProps} from '@atb/screens/Map/index';
import {Place, Quay} from '@atb/api/types/departures';
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import StatusBarOnFocus from '@atb/components/status-bar-on-focus';
import {SelectionLocationCallback} from '@atb/components/map/types';

export const MapScreen = ({navigation}: MapScreenProps<'MapScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;

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
      activeItemIndex: 0,
    });
  };
  const onLocationSelect: SelectionLocationCallback = (location, as) => {
    location &&
      as &&
      navigation.navigate({
        name: 'DashboardRoot' as any,
        params: {
          [as]: location,
        },
      });
  };

  return (
    <>
      <StatusBarOnFocus barStyle="dark-content" />
      <Map
        selectionMode={'ExploreStops'}
        navigateToQuay={navigateToQuay}
        navigateToDetails={navigateToDetails}
        onLocationSelect={onLocationSelect}
      />
    </>
  );
};
