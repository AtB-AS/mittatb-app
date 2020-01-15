import {useState, useEffect} from 'react';
import {PermissionsAndroid, PermissionStatus, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function useGeolocationPermission() {
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
