import {useAppState} from '@atb/AppContext';
import {trackNavigation} from '@atb/diagnostics/trackNavigation';
import {Root_OnboardingStack} from './Root_OnboardingStack';
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
import {RootStackParamList} from './navigation-types';
import {useTestIds} from './use-test-ids';
import {parse} from 'search-params';

import type {NavigationState, PartialState} from '@react-navigation/routers';
import {Root_MobileTokenOnboardingStack} from './Root_MobileTokenOnboarding';
import {useDeparturesV2Enabled} from './Root_TabNavigatorStack/TabNav_DeparturesStack';
import {Root_AddEditFavoritePlaceScreen} from './Root_AddEditFavoritePlaceScreen';
import {Root_SearchStopPlaceScreen} from './Root_SearchStopPlaceScreen';
import {Root_LocationSearchByMapScreen} from '@atb/stacks-hierarchy/Root_LocationSearchByMapScreen';
import {Root_LocationSearchByTextScreen} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Root_PurchaseOverviewScreen} from './Root_PurchaseOverviewScreen';
import {Root_PurchaseConfirmationScreen} from './Root_PurchaseConfirmationScreen';
import {Root_PurchaseTariffZonesSearchByMapScreen} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {Root_PurchaseTariffZonesSearchByTextScreen} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByTextScreen';
import {Root_PurchasePaymentWithCreditCardScreen} from '@atb/stacks-hierarchy/Root_PurchasePaymentWithCreditCardScreen';
import {Root_PurchasePaymentWithVippsScreen} from '@atb/stacks-hierarchy/Root_PurchasePaymentWithVippsScreen';
import {Root_PurchaseAsAnonymousConsequencesScreen} from '@atb/stacks-hierarchy/Root_PurchaseAsAnonymousConsequencesScreen';
import {Root_TicketAssistantStack} from '@atb/stacks-hierarchy/Root_TicketAssistantStack';
import {Root_TipsAndInformation} from '@atb/stacks-hierarchy/Root_TipsAndInformation';
import {Root_FareContractDetailsScreen} from '@atb/stacks-hierarchy/Root_FareContractDetailsScreen';
import {Root_CarnetDetailsScreen} from '@atb/stacks-hierarchy/Root_CarnetDetailsScreen';
import {Root_ReceiptScreen} from '@atb/stacks-hierarchy/Root_ReceiptScreen';
import {Root_LoginActiveFareContractWarningScreen} from '@atb/stacks-hierarchy/Root_LoginActiveFareContractWarningScreen';
import {Root_LoginOptionsScreen} from '@atb/stacks-hierarchy/Root_LoginOptionsScreen';
import {Root_LoginPhoneInputScreen} from '@atb/stacks-hierarchy/Root_LoginPhoneInputScreen';
import {Root_LoginConfirmCodeScreen} from '@atb/stacks-hierarchy/Root_LoginConfirmCodeScreen';
import {Root_LoginRequiredForFareProductScreen} from '@atb/stacks-hierarchy/Root_LoginRequiredForFareProductScreen';
import {Root_ActiveTokenOnPhoneRequiredForFareProductScreen} from '@atb/stacks-hierarchy/Root_ActiveTokenOnPhoneRequiredForFareProductScreen';

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
          index: 1,
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
          name: 'Nearby_RootScreen',
          index: 0,
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
    if (path.includes('details')) {
      destination.push({
        name: departuresV2Enabled
          ? 'Departures_DepartureDetailsScreen'
          : 'Nearby_DepartureDetailsScreen',
        params: {
          activeItemIndex: 0,
          items: [
            {
              serviceJourneyId: params.serviceJourneyId,
              serviceDate: params.serviceDate,
              date: new Date(),
              fromQuayId: params.quayId,
            },
          ],
        },
      });
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
                        Ticketing_RootScreen: {
                          screens: {
                            TicketTabNav_ActiveFareProductsTabScreen:
                              'ticketing',
                          },
                        },
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
                                {
                                  name: 'Dashboard_NearbyStopPlacesScreen',
                                  params: {mode: 'Favourite'},
                                },
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
                name="Root_OnboardingStack"
                component={Root_OnboardingStack}
              />
              <Stack.Screen
                name="Root_LocationSearchByTextScreen"
                component={Root_LocationSearchByTextScreen}
              />
              <Stack.Screen
                name="Root_LocationSearchByMapScreen"
                component={Root_LocationSearchByMapScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Root_PurchaseOverviewScreen"
                component={Root_PurchaseOverviewScreen}
              />
              <Stack.Screen
                name="Root_PurchaseConfirmationScreen"
                component={Root_PurchaseConfirmationScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen
                name="Root_PurchaseTariffZonesSearchByMapScreen"
                component={Root_PurchaseTariffZonesSearchByMapScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen
                name="Root_PurchaseTariffZonesSearchByTextScreen"
                component={Root_PurchaseTariffZonesSearchByTextScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen
                name="Root_PurchasePaymentWithCreditCardScreen"
                component={Root_PurchasePaymentWithCreditCardScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen
                name="Root_PurchasePaymentWithVippsScreen"
                component={Root_PurchasePaymentWithVippsScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen
                name="Root_PurchaseAsAnonymousConsequencesScreen"
                component={Root_PurchaseAsAnonymousConsequencesScreen}
              />
              <Stack.Screen
                name="Root_FareContractDetailsScreen"
                component={Root_FareContractDetailsScreen}
              />
              <Stack.Screen
                name="Root_CarnetDetailsScreen"
                component={Root_CarnetDetailsScreen}
              />
              <Stack.Screen
                name="Root_ReceiptScreen"
                component={Root_ReceiptScreen}
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
                name="Root_TicketAssistantStack"
                component={Root_TicketAssistantStack}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen
                name="Root_TipsAndInformation"
                component={Root_TipsAndInformation}
              />
              <Stack.Screen
                name="Root_LoginActiveFareContractWarningScreen"
                component={Root_LoginActiveFareContractWarningScreen}
              />
              <Stack.Screen
                name="Root_LoginOptionsScreen"
                component={Root_LoginOptionsScreen}
              />
              <Stack.Screen
                name="Root_LoginPhoneInputScreen"
                component={Root_LoginPhoneInputScreen}
              />
              <Stack.Screen
                name="Root_LoginConfirmCodeScreen"
                component={Root_LoginConfirmCodeScreen}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen
                name="Root_LoginRequiredForFareProductScreen"
                component={Root_LoginRequiredForFareProductScreen}
              />
              <Stack.Screen
                name="Root_ActiveTokenOnPhoneRequiredForFareProductScreen"
                component={Root_ActiveTokenOnPhoneRequiredForFareProductScreen}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </Host>
    </>
  );
};
