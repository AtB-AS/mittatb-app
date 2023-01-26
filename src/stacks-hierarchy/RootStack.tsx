import {useAppState} from '@atb/AppContext';
import trackNavigation from '@atb/diagnostics/trackNavigation';
import {LocationSearchStack} from '@atb/location-search';
import LoginInAppStack from '@atb/login/in-app/LoginInAppStack';
import {Root_OnboardingStack} from './Root_OnboardingStack';
import Purchase from './Root_TabNavigatorStack/TabNav_TicketingStack/Purchase';
import FareContractModalScreen from './Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Details';
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
import {Root_TabNavigatorStack} from './Root_TabNavigatorStack';
import {transitionSpec} from '@atb/utils/transition-spec';
import {RootStackParamList} from './navigation-types';
import useTestIds from './use-test-ids';
import {parse} from 'search-params';

import type {NavigationState, PartialState} from '@react-navigation/routers';
import {Root_MobileTokenOnboardingStack} from './Root_MobileTokenOnboarding';
import {useDeparturesV2Enabled} from './Root_TabNavigatorStack/TabNav_DeparturesStack';
import {Root_AddEditFavoritePlaceScreen} from './Root_AddEditFavoritePlaceScreen';
import {Root_SearchStopPlaceScreen} from './Root_SearchStopPlaceScreen';

type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootStack = () => {
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

  function getResultStateFromPath(path: string): ResultState {
    const params = parse(path);
    let destination: PartialRoute<any>[] | undefined;

    if (departuresV2Enabled) {
      destination = [
        {
          // Index is needed so that the user can go back after
          // opening the app with the widget when it was not open previously
          index: 0,
          name: 'Departures_NearbyStopPlacesScreen',
        },
        {
          name: 'Departures_PlaceScreen',
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
          name: 'Root_TabNavigatorStack',
          state: {
            routes: [
              {
                name: 'TabNav_NearestStack',
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
                Root_TabNavigatorStack: {
                  screens: {
                    TabNav_ProfileStack: 'profile',
                    TabNav_TicketingStack: {
                      screens: {
                        ActiveFareProductsAndReservationsTab: 'ticketing',
                      },
                    },
                  },
                },
              },
            },
            getStateFromPath(path, config) {
              // If the path is not from the widget, behave as usual
              if (!path.includes('widget')) {
                return getStateFromPath(path, config);
              }

              // User get redirected to add new favorite departure
              if (path.includes('addFavoriteDeparture')) {
                return {
                  routes: [
                    {
                      name: 'Root_TabNavigatorStack',
                      state: {
                        routes: [
                          {
                            name: 'TabNav_DashboardStack',
                            state: {
                              routes: [
                                {name: 'Dashboard_RootScreen', index: 0},
                                {name: 'Dashboard_NearbyStopPlacesScreen'},
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                } as ResultState;
              }

              // Get redirected to the preferred departures view
              return getResultStateFromPath(path);
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
                <Stack.Screen
                  name="Root_OnboardingStack"
                  component={Root_OnboardingStack}
                />
                <Stack.Screen name="LoginInApp" component={LoginInAppStack} />
              </Stack.Group>
            ) : (
              <Stack.Group
                screenOptions={{
                  presentation: 'modal',
                  ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
              >
                <Stack.Screen
                  name="Root_TabNavigatorStack"
                  component={Root_TabNavigatorStack}
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
                  name="Root_MobileTokenOnboardingStack"
                  component={Root_MobileTokenOnboardingStack}
                />
                <Stack.Screen
                  name="Root_AddEditFavoritePlaceScreen"
                  component={Root_AddEditFavoritePlaceScreen}
                />
                <Stack.Screen
                  name="Root_SearchStopPlaceScreen"
                  component={Root_SearchStopPlaceScreen}
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
