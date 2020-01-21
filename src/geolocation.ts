import {useState, useEffect} from 'react';
import {Platform, Rationale} from 'react-native';
import Geolocation, {
  GeolocationResponse,
  GeolocationOptions,
} from '@react-native-community/geolocation';
import {
  request,
  check,
  PERMISSIONS,
  PermissionStatus,
} from 'react-native-permissions';

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  useEffect(() => {
    const config: GeolocationOptions = {enableHighAccuracy: true};

    Geolocation.getCurrentPosition(
      position => setLocation(position),
      () => setLocation(null),
      {...config, maximumAge: 0},
    );

    const watchId = Geolocation.watchPosition(
      position => setLocation(position),
      () => setLocation(null),
      config,
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);
  return location;
}

export function useCheckGeolocationPermission() {
  const [hasPermission, setHasPermission] = useState<PermissionStatus | null>(
    null,
  );

  async function checkPermission() {
    let status: PermissionStatus;
    if (Platform.OS === 'ios') {
      status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    setHasPermission(status);
  }

  checkPermission();

  return hasPermission;
}

export async function requestGeolocationPermission(): Promise<
  PermissionStatus
> {
  const rationale: Rationale = {
    title: 'Vil du gi AtB Reise tilgang til posisjonen din?',
    message: 'Vi trenger din posisjon for å lage reiseruter',
    buttonNeutral: 'Spør meg senere',
    buttonNegative: 'Ikke tillat',
    buttonPositive: 'Tillat',
  };

  if (Platform.OS === 'ios') {
    return await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, rationale);
  } else {
    return await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, rationale);
  }
}
