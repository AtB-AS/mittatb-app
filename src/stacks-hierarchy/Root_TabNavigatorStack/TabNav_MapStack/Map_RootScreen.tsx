import React from 'react';
import {
  Map,
  NavigateToTripSearchCallback as TravelFromAndToLocationsCallback,
} from '@atb/components/map';
import {MapScreenProps} from './navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import {StatusBarOnFocus} from '@atb/components/status-bar-on-focus';
import {Coordinates} from '@atb/utils/coordinates';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {getVehicles} from '@atb/api/vehicles';
import {toFeatureCollection, toGeoJSONFeature} from '@atb/components/map/utils';
import {FetchEntitiesCallback} from '@atb/components/map/types';

export const Map_RootScreen = ({
  navigation,
}: MapScreenProps<'Map_RootScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;
  const navigateToQuay = (place: StopPlace, quay: Quay) => {
    navigation.navigate('Map_PlaceScreen', {
      place,
      selectedQuayId: quay.id,
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
    navigation.navigate('Map_DepartureDetailsScreen', {
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
      name: 'Dashboard_TripSearchScreen',
      params: {
        [destination]: location,
        callerRoute: {name: 'Map_RootScreen'},
      },
      merge: true,
    });
  };

  const fetchVehicles: FetchEntitiesCallback<VehicleFragment> = async (
    {latitude: lat, longitude: lon}: Coordinates,
    radius = 500,
  ) =>
    getVehicles({lat, lon, range: radius})
      .then(toGeoJSONFeature)
      .then(toFeatureCollection);

  return (
    <>
      <StatusBarOnFocus barStyle="dark-content" />
      <Map
        selectionMode={'ExploreStops'}
        fetchVehicles={fetchVehicles}
        navigateToQuay={navigateToQuay}
        navigateToDetails={navigateToDetails}
        navigateToTripSearch={navigateToTripSearch}
      />
    </>
  );
};
