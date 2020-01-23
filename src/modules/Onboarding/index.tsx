import React, {createContext, useState, useEffect} from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {HomeLocation, WorkLocation} from './LocationForms';
import GeoPermission from './GeoPermission';
import {useCheckGeolocationPermission, useGeolocation} from '../../geolocation';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../';
import Splash from '../Splash';
import {Location} from './LocationInput';
import {GeolocationResponse} from '@react-native-community/geolocation';
import Final from './Final';

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

type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

type Props = {
  route: OnboardingScreenRouteProp;
};

const OnboardingRoot: React.FC<Props> = ({route}) => {
  const permissionStatus = useCheckGeolocationPermission();
  const location = useGeolocation(permissionStatus === 'granted');

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

  const {completeOnboarding} = route.params;

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
