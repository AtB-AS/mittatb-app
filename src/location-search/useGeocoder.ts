import {useState, useEffect} from 'react';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {Feature} from '../sdk';
import {autocomplete, reverse} from '../api';
import {Location} from '../favorites/types';
import {CancelToken, isCancel} from '../api/client';

const BOUNDARY_FILTER = () => {
  const filter = {
    min_lat: 62.5815885,
    max_lat: 64.082649,
    min_lon: 8.745761,
    max_lon: 11.92081,
  };
  return Object.entries(filter)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
};

export function useGeocoder(
  text: string | null,
  location: GeolocationResponse | null,
) {
  const [locations, setLocations] = useState<Location[] | null>(null);

  useEffect(() => {
    const source = CancelToken.source();
    async function textLookup() {
      if (!text || text.length < 4) {
        setLocations(null);
      } else {
        try {
          const response = await autocomplete(text, location, {
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
  }, [location, text]);

  return locations;
}

export function useReverseGeocoder(location: GeolocationResponse | null) {
  const [locations, setLocations] = useState<Location[] | null>(null);

  useEffect(() => {
    const source = CancelToken.source();
    async function reverseCoordLookup() {
      if (location && location.coords) {
        try {
          const response = await reverse(location, {
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
  }, [location]);

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
