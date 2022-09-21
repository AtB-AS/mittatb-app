import React from 'react';
import Map from '@atb/components/map/Map';
import {useGeolocationState} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';

export function MapScreen() {
  const {location} = useGeolocationState();
  const currentLocationCoordinates = location?.coordinates || FOCUS_ORIGIN;
  return (
    <Map
      coordinates={{...currentLocationCoordinates, zoomLevel: 12}}
      shouldExploreTripOptions={true}
    />
  );
}
