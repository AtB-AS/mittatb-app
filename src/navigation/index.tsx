import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import trackNavigation from '../diagnostics/trackNavigation';
import {useAppState} from '../AppContext';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import TabNavigator from './TabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  TabNavigator: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();

  return (
    <SafeAreaProvider>
      <NavigationContainer onStateChange={trackNavigation}>
        <Stack.Navigator headerMode="none">
          {isLoading ? (
            <Stack.Screen name="Splash" component={Splash} />
          ) : !onboarded ? (
            <Stack.Screen name="Onboarding" component={Onboarding} />
          ) : (
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default NavigationRoot;
