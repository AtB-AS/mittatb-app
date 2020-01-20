import React, {useEffect, useMemo, useReducer} from 'react';
import {NavigationNativeContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Onboarding from './modules/Onboarding';
import Splash from './modules/Splash';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import AppContext, {UserLocations} from './appContext';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: {completeOnboarding: (userLocations: UserLocations) => void};
};

const Stack = createStackNavigator<RootStackParamList>();

type AppState = {
  isLoading: boolean;
  userLocations: UserLocations | null;
};

type AppReducerAction = {
  userLocations: UserLocations | null;
  type: 'LOADED_USER_LOCATIONS' | 'SET_USER_LOCATIONS';
};

type AppReducer = (prevState: AppState, action: AppReducerAction) => AppState;

const App = () => {
  const [state, dispatch] = useReducer<AppReducer>(
    (prevState, action) => {
      switch (action.type) {
        case 'LOADED_USER_LOCATIONS':
          return {
            ...prevState,
            userLocations: action.userLocations,
            isLoading: false,
          };
        case 'SET_USER_LOCATIONS':
          return {
            ...prevState,
            userLocations: action.userLocations,
          };
      }
    },
    {
      isLoading: true,
      userLocations: null,
    },
  );

  useEffect(() => {
    async function checkOnboarded() {
      const storedLocations = await AsyncStorage.getItem(
        'stored_user_locations',
      );
      dispatch({
        type: 'LOADED_USER_LOCATIONS',
        userLocations: storedLocations ? JSON.parse(storedLocations) : null,
      });
    }
    checkOnboarded();
  }, []);

  const onboardingParams = useMemo(
    () => ({
      completeOnboarding: async (userLocations: UserLocations) => {
        await AsyncStorage.setItem(
          'stored_user_locations',
          JSON.stringify(userLocations),
        );
        dispatch({type: 'SET_USER_LOCATIONS', userLocations});
      },
    }),
    [],
  );

  return (
    <AppContext.Provider value={{userLocations: state.userLocations}}>
      <SafeAreaProvider>
        <NavigationNativeContainer>
          <Stack.Navigator headerMode="none">
            {state.isLoading ? (
              <Stack.Screen name="Splash" component={Splash} />
            ) : !state.userLocations ? (
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                initialParams={onboardingParams}
              />
            ) : null}
          </Stack.Navigator>
        </NavigationNativeContainer>
      </SafeAreaProvider>
    </AppContext.Provider>
  );
};

export default App;
