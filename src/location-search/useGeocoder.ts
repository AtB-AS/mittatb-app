import {useState, useEffect} from 'react';
import {Feature, Coordinates} from '../sdk';
import {autocomplete, reverse} from '../api';
import {Location} from '../favorites/types';
import {CancelToken, isCancel} from '../api/client';

export function useGeocoder(text: string | null, coords: Coordinates | null) {
  const [locations, setLocations] = useState<Location[] | null>(null);

  useEffect(() => {
    const source = CancelToken.source();
    async function textLookup() {
      if (!text) {
        setLocations(null);
      } else {
        try {
          const response = await autocomplete(text, coords, {
            cancelToken: source.token,
          });
          source.token.throwIfRequested();
          setLocations(response?.data?.map(mapFeatureToLocation));
        } catch (err) {
          if (!isCancel(err)) {
            console.warn(err);
          }
          setLocations(null);
        }
      }
    }

    textLookup();
    return () => source.cancel('Cancelling previous autocomplete');
  }, [coords?.latitude, coords?.longitude, text]);

  return locations;
}

export function useReverseGeocoder(coords: Coordinates | null) {
  const [locations, setLocations] = useState<Location[] | null>(null);

  useEffect(() => {
    const source = CancelToken.source();
    async function reverseCoordLookup() {
      if (coords) {
        try {
          const response = await reverse(coords, {
            cancelToken: source.token,
          });
          source.token.throwIfRequested();

          setLocations(response?.data?.map(mapFeatureToLocation));
        } catch (err) {
          if (!isCancel(err)) {
            console.warn(err);
          }
          setLocations(null);
        }
      } else {
        setLocations(null);
      }
    }

    reverseCoordLookup();
    return () => source.cancel('Cancelling previous reverse');
  }, [coords?.latitude, coords?.longitude]);

  return locations;
}

// IMPORTANT: Feature coordinate-array is [long, lat] :sadface:. Mapping to lat/long object for less bugs downstream.
const mapFeatureToLocation = ({
  geometry: {
    coordinates: [longitude, latitude],
  },
  properties,
}: Feature): Location => ({
  ...properties,
  coordinates: {latitude, longitude},
});
