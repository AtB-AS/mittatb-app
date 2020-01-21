import React, {createContext, useState} from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {HomeLocation, WorkLocation} from './LocationForms';
import GeoPermission from './GeoPermission';
import {useCheckGeolocationPermission} from '../../geolocation';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../';
import Splash from '../Splash';
import {Location} from './LocationInput';
import {UserLocations} from 'src/appContext';

type OnboardingContextValue = {
  setHomeLocation: (location: Location) => void;
  setWorkLocation: (location: Location) => void;
  completeOnboarding: () => void;
};

export const OnboardingContext = createContext<
  OnboardingContextValue | undefined
>(undefined);

export type OnboardingStackParamList = {
  GeoPermission: undefined;
  HomeLocation: undefined;
  WorkLocation: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

type Props = {
  route: OnboardingScreenRouteProp;
};

const OnboardingRoot: React.FC<Props> = ({route}) => {
  const permissionStatus = useCheckGeolocationPermission();
  const [home, setHomeLocation] = useState<Location | null>(null);
  const [work, setWorkLocation] = useState<Location | null>(null);

  if (!permissionStatus) {
    return <Splash />;
  }

  const {completeOnboarding} = route.params;

  return (
    <OnboardingContext.Provider
      value={{
        setHomeLocation,
        setWorkLocation,
        completeOnboarding: () => {
          if (home && work) {
            completeOnboarding({home, work});
          }
        },
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
      </Stack.Navigator>
    </OnboardingContext.Provider>
  );
};

export default OnboardingRoot;
