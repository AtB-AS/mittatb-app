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
import {StatusBar} from 'react-native';
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

  function getParamsFromQuery(query: string): {[name: string]: string} {
    const paramArr = query.slice(query.indexOf('?') + 1).split('&');
    const params: {[name: string]: string} = {};
    paramArr.map((param) => {
      const [key, val] = param.split('=');
      params[key] = val.replace('%20', ' ');
    });
    return params;
  }

  function stateFromWidget(params: {[name: string]: string}): ResultState {
    let destination: PartialRoute<any>[] | undefined;

    if (departuresV2Enabled) {
      destination = [
        {
          // Index is needed so that the user can go back after
          //opening the app with the widget when it was not open previously
          index: 0,
          name: 'DeparturesScreen',
        },
        {
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
        },
      ];
    } else {
      destination = [
        {
          name: 'NearbyRoot',
          params: {
            location: {
              id: params.stopId,
              name: params.stopName,
              label: params.stopName,
              layer: 'address',
              coordinates: {
                latitude: params.latitude,
                longitude: params.longitude,
              },
              resultType: 'search',
            },
          },
        },
      ];
    }

    return {
      routes: [
        {
          name: 'TabNavigator',
          state: {
            routes: [
              {
                name: 'Nearest',
                state: {
                  routes: destination as PartialRoute<Route<string>>[],
                },
              },
            ],
          },
        },
      ],
    };
  }

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
              //If the path is not from the widget, behave as usual
              if (!path.includes('widget')) {
                return getStateFromPath(path, config);
              }

              //User get redirected to add new favorite departure
              if (path.includes('addFavoriteDeparture')) {
                return {
                  routes: [
                    {
                      name: 'TabNavigator',
                      state: {
                        routes: [
                          {
                            name: 'Dashboard',
                            state: {
                              routes: [
                                {name: 'DashboardRoot', index: 0},
                                {name: 'NearbyStopPlacesDashboardScreen'},
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                } as ResultState;
              }

              const params = getParamsFromQuery(path);

              //Get redirected to the preferred departures view
              return stateFromWidget(params);
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
