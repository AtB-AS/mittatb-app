import React, {createContext, useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeLocation, WorkLocation} from './LocationForms';
import GeoPermission from './GeoPermission';
import Splash from '../Splash';
import {GeolocationResponse} from '@react-native-community/geolocation';
import Final from './Final';
import {Location, useAppState} from '../../AppContext';
import {useGeolocationState} from '../../GeolocationContext';

type OnboardingContextValue = {
  location: GeolocationResponse | null;
  setHomeLocation: (location: Location) => void;
  setWorkLocation: (location: Location) => void;
};

export const OnboardingContext = createContext<
  OnboardingContextValue | undefined
>(undefined);

export type OnboardingStackParamList = {
  GeoPermission: undefined;
  HomeLocation: undefined;
  WorkLocation: undefined;
  Final: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingRoot: React.FC = () => {
  const {completeOnboarding} = useAppState();
  const {status: permissionStatus, location} = useGeolocationState();
  const [home, setHomeLocation] = useState<Location | null>(null);
  const [work, setWorkLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (home && work) {
      completeOnboarding({home, work});
    }
  }, [home, work]);

  if (!permissionStatus) {
    return <Splash />;
  }

  return (
    <OnboardingContext.Provider
      value={{
        location,
        setHomeLocation,
        setWorkLocation,
      }}
    >
      <Stack.Navigator
        initialRouteName={
          permissionStatus !== 'granted' ? 'GeoPermission' : 'HomeLocation'
        }
        headerMode="none"
      >
        <Stack.Screen name="GeoPermission" component={GeoPermission} />
        <Stack.Screen name="HomeLocation" component={HomeLocation} />
        <Stack.Screen name="WorkLocation" component={WorkLocation} />
        <Stack.Screen name="Final" component={Final} />
      </Stack.Navigator>
    </OnboardingContext.Provider>
  );
};

export default OnboardingRoot;
