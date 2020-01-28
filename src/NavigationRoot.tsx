import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationNativeContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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
  const appState = useAppState();

  return (
    <SafeAreaProvider>
      <NavigationNativeContainer>
        <Stack.Navigator headerMode="none">
          {appState.isLoading ? (
            <Stack.Screen name="Splash" component={Splash} />
          ) : !appState.userLocations ? (
            <Stack.Screen name="Onboarding" component={Onboarding} />
          ) : (
            <Stack.Screen name="Planner" component={Planner} />
          )}
        </Stack.Navigator>
      </NavigationNativeContainer>
    </SafeAreaProvider>
  );
};

export default NavigationRoot;
