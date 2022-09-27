import React from 'react';
import {useGeolocationState} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {Map} from '@atb/components/map';

export function MapScreen() {
  const {location} = useGeolocationState();
  const currentLocationCoordinates = location?.coordinates || FOCUS_ORIGIN;
  return (
    <Map
      coordinates={{...currentLocationCoordinates}}
      zoomLevel={12}
      selectionMode={'ExploreStops'}
    />
  );
}
