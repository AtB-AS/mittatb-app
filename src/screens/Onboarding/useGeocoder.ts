import {useState, useEffect} from 'react';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {Location} from '../../AppContext';
import {Feature} from '../../sdk';
import {autocomplete, reverse} from '../../api';

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
    async function textLookup() {
      if (!text || text.length < 4) {
        setLocations(null);
      } else {
        try {
          const response = await autocomplete(text, location);
          setLocations(response?.data?.map(mapFeatureToLocation));
        } catch (err) {
          console.warn(err);
          setLocations(null);
        }
      }
    }

    textLookup();
  }, [location, text]);

  return locations;
}

export function useReverseGeocoder(location: GeolocationResponse | null) {
  const [locations, setLocations] = useState<Location[] | null>(null);

  useEffect(() => {
    async function reverseCoordLookup() {
      if (location && location.coords) {
        try {
          const response = await reverse(location);

          setLocations(response?.data?.map(mapFeatureToLocation));
        } catch (err) {
          console.warn(err);
          setLocations(null);
        }
      } else {
        setLocations(null);
      }
    }

    reverseCoordLookup();
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
  coordinates: {latitude, longitude},
  id: properties.id,
  name: properties.name,
  label: properties.label,
  locality: properties.locality,
});
