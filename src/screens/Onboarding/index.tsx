import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeLocation, WorkLocation} from './LocationForms';
import GeoPermission from './GeoPermission';
import Final from './Final';
import {useAppState} from '../../AppContext';
import OnboardingContextProvider from './OnboardingContext';

export type OnboardingStackParamList = {
  GeoPermission: undefined;
  HomeLocation: undefined;
  WorkLocation: undefined;
  Final: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingRoot: React.FC = () => {
  const {onboarded} = useAppState();
  return (
    <OnboardingContextProvider>
      <Stack.Navigator
        initialRouteName={!onboarded ? 'GeoPermission' : 'HomeLocation'}
        headerMode="none"
      >
        <Stack.Screen name="GeoPermission" component={GeoPermission} />
        <Stack.Screen name="HomeLocation" component={HomeLocation} />
        <Stack.Screen name="WorkLocation" component={WorkLocation} />
        <Stack.Screen name="Final" component={Final} />
      </Stack.Navigator>
    </OnboardingContextProvider>
  );
};

export default OnboardingRoot;
