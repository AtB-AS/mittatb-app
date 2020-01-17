import {useState, useEffect} from 'react';
import {GeolocationResponse} from '@react-native-community/geolocation';
import axios from 'axios';

export function useGeocoder(
  text: string | null,
  location: GeolocationResponse | null,
) {
  const [features, setFeatures] = useState<Feature[] | null>(null);

  useEffect(() => {
    async function textLookup() {
      if (!text || text.length < 3) {
        setFeatures(null);
      } else {
        const url =
          'https://geocoder-7fqsxwljoa-ew.a.run.app/autocomplete?text=' +
          text +
          (location
            ? '&focus.point.lat=' +
              location.coords.latitude +
              '&focus.point.lon=' +
              location.coords.longitude
            : 'boundary.county_ids=50') +
          '&size=10&layers=address,locality&refreshkey=opn';

        const response = await axios.get<GeocodeResponse>(url);

        setFeatures(response?.data?.features);
      }
    }

    textLookup();
  }, [location, text]);

  return features;
}

export function useReverseGeocoder(location: GeolocationResponse | null) {
  const [features, setFeatures] = useState<Feature[] | null>(null);

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

          setFeatures(response?.data?.features);
        } catch (err) {
          console.warn(err);
          setFeatures(null);
        }
      } else {
        setFeatures(null);
      }
    }

    reverseCoordLookup();
  }, [location]);

  return features;
}

type GeocodeResponse = {
  features: Feature[];
};

export type Feature = {
  geometry: {coordinates: [number, number]};
  properties: {distance: number; id: string; label: string; name: string};
  type: string;
};
