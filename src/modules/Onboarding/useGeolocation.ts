import {useState, useEffect} from 'react';
import {PermissionsAndroid, PermissionStatus, Platform} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => setLocation(position),
      () => setLocation(null),
      {enableHighAccuracy: true},
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);
  return location;
}

export function useGeolocationPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    async function requestGeolocation() {
      if (Platform.OS === 'android') {
        await requestAndroid();
      } else {
        Geolocation.requestAuthorization();
      }
      setHasPermission(true);
    }

    requestGeolocation();
  });

  return hasPermission;
}

async function requestAndroid(): Promise<PermissionStatus | null> {
  return await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Vil du gi AtB Reise tilgang til posisjonen din?',
      message: 'Vi trenger din posisjon for å lage reiseruter',
      buttonNeutral: 'Spør meg senere',
      buttonNegative: 'Ikke tillat',
      buttonPositive: 'Tillat',
    },
  );
}
