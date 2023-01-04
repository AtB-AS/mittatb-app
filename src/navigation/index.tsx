import {useAppState} from '@atb/AppContext';
import trackNavigation from '@atb/diagnostics/trackNavigation';
import {LocationSearchStack} from '@atb/location-search';
import LoginInAppStack from '@atb/login/in-app/LoginInAppStack';
import ConsequencesScreen from '@atb/screens/AnonymousPurchase/ConsequencesScreen';
import MobileTokenOnboarding from '@atb/screens/MobileTokenOnboarding';
import Onboarding from '@atb/screens/Onboarding';
import AddEditFavorite from '@atb/screens/Profile/AddEditFavorite';
import SortableFavoriteList from '@atb/screens/Profile/FavoriteList/SortFavorites';
import SelectTravelTokenScreen from '@atb/screens/Profile/TravelToken/SelectTravelTokenScreen';
import Purchase from '@atb/screens/Ticketing/Purchase';
import FareContractModalScreen from '@atb/screens/Ticketing/FareContracts/Details';
import {useTheme} from '@atb/theme';
import {APP_SCHEME} from '@env';
import {
  DefaultTheme,
  getStateFromPath,
  NavigationContainer,
  PartialRoute,
  Route,
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {Linking, StatusBar} from 'react-native';
import {Host} from 'react-native-portalize';
import TabNavigator from './TabNavigator';
import transitionSpec from './transitionSpec';
import {RootStackParamList} from './types';
import useTestIds from './use-test-ids';
import {useDeparturesV2Enabled} from '@atb/screens/Departures/use-departures-v2-enabled';
import type {NavigationState, PartialState} from '@react-navigation/routers';

const Stack = createStackNavigator<RootStackParamList>();

type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
};

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();
  const {theme} = useTheme();
  const departuresV2Enabled = useDeparturesV2Enabled();

  useTestIds();

  if (isLoading) {
    return null;
  }

  const statusBarColor = onboarded
    ? theme.static.background.background_accent_0.background
    : theme.static.background.background_accent_3.background;

  const ReactNavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.static.background.background_1.background,
    },
  };

  return (
    <>
      <StatusBar
        barStyle={theme.statusBarStyle}
        translucent={true}
        backgroundColor={statusBarColor}
      />
      <Host>
        <NavigationContainer<RootStackParamList>
          onStateChange={trackNavigation}
          theme={ReactNavigationTheme}
          linking={{
            prefixes: [`${APP_SCHEME}://`],
            config: {
              screens: {
                TabNavigator: {
                  screens: {
                    Profile: 'profile',
                    Dashboard: {
                      screens: {
                        NearbyStopPlacesDashboardScreen: 'addFavoriteDeparture',
                      },
                    },
                    Ticketing: {
                      screens: {
                        ActiveFareProductsAndReservationsTab: 'ticketing',
                      },
                    },
                  },
                },
              },
            },
            getStateFromPath(path, config) {
              console.log('path :' + path);
              if (!path.includes('widget')) {
                return getStateFromPath(path, config);
              }
              const paramArr = path.slice(path.indexOf('?') + 1).split('&');
              const params: {[name: string]: string} = {};
              paramArr.map((param) => {
                const [key, val] = param.split('=');
                params[key] = val;
              });

              let destination: PartialRoute<Route<string>> | undefined;

              if (departuresV2Enabled) {
                destination = {
                  name: 'PlaceScreen',
                  params: {
                    place: {
                      name: params.stopName,
                      id: params.stopId,
                    },
                    selectedQuayId: params.quayId,
                    showOnlyFavoritesByDefault: true,
                    mode: 'Departure',
                  },
                };
              } else {
                destination = {
                  name: 'NearbyScreen',
                  state: {
                    routes: [
                      {
                        name: 'NearbyRoot',
                        params: {
                          currentLocation: {
                            id: `geo-${params.latitude}-${params.longitude}`,
                            name: params.stopName,
                            layer: 'venue',
                            coordinates: {
                              latitude: params.latitude,
                              longitude: params.longitude,
                            },
                            locality: '',
                            category: [],
                          },
                          resultType: 'favorite',
                        },
                      },
                    ],
                  },
                  params: {
                    currentLocation: {
                      id: `geo-${params.latitude}-${params.longitude}`,
                      name: params.stopName,
                      layer: 'venue',
                      coordinates: {
                        latitude: params.latitude,
                        longitude: params.longitude,
                      },
                      locality: '',
                      category: [],
                    },
                    resultType: 'favorite',
                  },
                };
              }

              const state: ResultState = {
                routes: [
                  {
                    name: 'TabNavigator',
                    state: {
                      routes: [
                        {
                          name: 'Nearest',
                          state: {
                            routes: [destination],
                          },
                        },
                      ],
                    },
                  },
                ],
              };
              return state;
            },
          }}
        >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            {!onboarded ? (
              <Stack.Group screenOptions={{presentation: 'card'}}>
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="LoginInApp" component={LoginInAppStack} />
              </Stack.Group>
            ) : (
              <Stack.Group
                screenOptions={{
                  presentation: 'modal',
                  ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
              >
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
                <Stack.Screen
                  name="ConsequencesFromPurchase"
                  component={ConsequencesScreen}
                />
                <Stack.Screen
                  name="LocationSearchStack"
                  component={LocationSearchStack}
                  options={TransitionPresets.ModalSlideFromBottomIOS}
                />
                <Stack.Screen name="Purchase" component={Purchase} />
                <Stack.Screen
                  name="FareContractModal"
                  component={FareContractModalScreen}
                />
                <Stack.Screen
                  name="MobileTokenOnboarding"
                  component={MobileTokenOnboarding}
                />
                <Stack.Screen
                  name="SelectTravelTokenRoot"
                  component={SelectTravelTokenScreen}
                />
                <Stack.Screen
                  name="AddEditFavorite"
                  component={AddEditFavorite}
                  options={TransitionPresets.ModalSlideFromBottomIOS}
                />
                <Stack.Screen
                  name="SortableFavoriteList"
                  component={SortableFavoriteList}
                  options={{
                    gestureResponseDistance: 100,
                    transitionSpec: {
                      open: transitionSpec,
                      close: transitionSpec,
                    },
                  }}
                />
                <Stack.Screen
                  name="LoginInApp"
                  component={LoginInAppStack}
                  options={{
                    transitionSpec: {
                      open: transitionSpec,
                      close: transitionSpec,
                    },
                  }}
                />
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Host>
    </>
  );
};

export default NavigationRoot;
