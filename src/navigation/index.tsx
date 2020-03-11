import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import trackNavigation from '../diagnostics/trackNavigation';
import {useAppState} from '../AppContext';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import TabNavigator from './TabNavigator';
import EmojiModalScreen from '../screens/Profile/AddEditFavorite/EmojiModal';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  TabNavigator: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParams = {
  Main: undefined;
  EmojiModal: {onEmojiSelected(emoji: string): void};
};

const RootStack = createStackNavigator<RootStackParams>();

const NavigationRoot = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer onStateChange={trackNavigation}>
        <RootStack.Navigator
          mode="modal"
          headerMode="none"
          screenOptions={{
            headerShown: false,
            cardOverlayEnabled: true,
            cardShadowEnabled: true,
          }}
        >
          <RootStack.Screen name="Main" component={Main} />
          <RootStack.Screen name="EmojiModal" component={EmojiModalScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

function Main() {
  const {isLoading, onboarded} = useAppState();

  return (
    <Stack.Navigator headerMode="none">
      {isLoading ? (
        <Stack.Screen name="Splash" component={Splash} />
      ) : !onboarded ? (
        <Stack.Screen name="Onboarding" component={Onboarding} />
      ) : (
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default NavigationRoot;
