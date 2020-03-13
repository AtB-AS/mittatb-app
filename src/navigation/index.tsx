import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import trackNavigation from '../diagnostics/trackNavigation';
import {useAppState} from '../AppContext';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import LocationSearch from '../location-search';
import TabNavigator from './TabNavigator';
import CloseModalCrossIcon from './svg/CloseModalCrossIcon';
import {useTheme} from '../theme';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  TabNavigator: undefined;
  LocationSearch: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();
  const {theme} = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer onStateChange={trackNavigation}>
        <Stack.Navigator mode={isLoading || !onboarded ? 'card' : 'modal'}>
          {isLoading ? (
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{headerShown: false}}
            />
          ) : !onboarded ? (
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{headerShown: false}}
            />
          ) : (
            <>
              <Stack.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="LocationSearch"
                component={LocationSearch}
                options={{
                  title: 'Søk',
                  headerBackTitleVisible: false,
                  headerTintColor: theme.text.primary,
                  headerStyle: {
                    backgroundColor: theme.background.secondary,
                    shadowColor: 'transparent',
                  },
                  headerBackImage: ({tintColor}) => (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        alignContent: 'center',
                        justifyContent: 'center',
                        marginLeft: 24,
                      }}
                    >
                      <CloseModalCrossIcon fill={tintColor} />
                    </View>
                  ),
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default NavigationRoot;
