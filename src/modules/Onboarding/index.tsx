import React, {createContext} from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import LocationForm from './LocationForm';
import GeoPermission from './GeoPermission';
import {useCheckGeolocationPermission} from '../../geolocation';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../';
import Splash from '../Splash';
import {Location} from './LocationInput';

type OnboardingContextValue = {
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
};

const Stack = createStackNavigator<OnboardingStackParamList>();

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
  route: OnboardingScreenRouteProp;
};

const HomeLocation: React.FC<{
  navigation: StackNavigationProp<OnboardingStackParamList>;
}> = ({navigation}) => (
  <LocationForm
    question="Hvor bor du?"
    label="Hjemmeadresse"
    placeholder="Legg til hjemmeadresse"
    buttonText="Neste"
    onLocationSelect={(location: Location) => {}}
  />
);

const WorkLocation: React.FC<{
  navigation: StackNavigationProp<OnboardingStackParamList>;
}> = () => (
  <LocationForm
    question="Hvor jobber du?"
    label="Jobbadresse"
    placeholder="Legg til jobbadresse"
    buttonText="Neste"
    onLocationSelect={(location: Location) => {}}
  />
);

const OnboardingRoot: React.FC<Props> = ({navigation, route}) => {
  const permissionStatus = useCheckGeolocationPermission();

  if (!permissionStatus) {
    return <Splash />;
  }

  return (
    <OnboardingContext.Provider value={{}}>
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
