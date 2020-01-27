import {useState, useEffect} from 'react';
import {GeolocationResponse} from '@react-native-community/geolocation';
import axios from 'axios';
import {Location} from '../../appContext';

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
        const url =
          'https://bff-oneclick-journey-planner-zmj3kfvboa-ew.a.run.app/geocoder/v1/autocomplete?text=' +
          text +
          (location
            ? '&focus.point.lat=' +
              location.coords.latitude +
              '&focus.point.lon=' +
              location.coords.longitude
            : 'boundary.county_ids=50') +
          '&size=10&layers=address,locality&refreshkey=opn';

        const response = await axios.get<GeocodeResponse>(url);

        setLocations(response?.data?.features?.map(mapFeatureToLocation));
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
          const response = await axios.get<GeocodeResponse>(
            'https://geocoder-7fqsxwljoa-ew.a.run.app/reverse?point.lat=' +
              location?.coords.latitude +
              '&point.lon=' +
              location?.coords.longitude +
              '&size=10&boundary.circle.radius=0.2&refreshkey=opn',
          );

          setLocations(response?.data?.features?.map(mapFeatureToLocation));
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

type GeocodeResponse = {
  features: Feature[];
};

type Feature = {
  geometry: {coordinates: [number, number]}; // [long, lat] :/
  properties: {distance: number; id: string; label: string; name: string};
  type: string;
};

// IMPORTANT: Feature coordinate-array is [long, lat] :sadface:. Mapping to lat/long object for less bugs downstream.
const mapFeatureToLocation = ({
  geometry: {
    coordinates: [longitude, latitude],
  },
  properties,
}: Feature): Location => ({
  coordinates: {latitude, longitude},
  ...properties,
});
