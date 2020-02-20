import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import trackNavigation from './diagnostics/trackNavigation';
import {useAppState} from './AppContext';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Planner from './screens/Planner';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Planner: undefined;
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
            <Stack.Screen name="Planner" component={Planner} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default NavigationRoot;
