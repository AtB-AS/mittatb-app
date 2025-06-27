import {trackNavigation} from '@atb/modules/diagnostics';
import {Root_ExtendedOnboardingStack} from './Root_ExtendedOnboardingStack';
import {useThemeContext} from '@atb/theme';
import {APP_SCHEME, APP_VERSION} from '@env';
import {
  DefaultTheme,
  getStateFromPath,
  NavigationContainer,
  PartialRoute,
  Route,
  useNavigationContainerRef,
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

import {Root_SelectTravelTokenScreen} from './Root_SelectTravelTokenScreen';
import {Root_ConsiderTravelTokenChangeScreen} from '@atb/stacks-hierarchy/Root_ConsiderTravelTokenChangeScreen';
import {Root_AddEditFavoritePlaceScreen} from './Root_AddEditFavoritePlaceScreen';
import {Root_SearchFavoritePlaceScreen} from './Root_SearchFavoritePlaceScreen';
import {Root_ShareTravelHabitsScreen} from './Root_ShareTravelHabitsScreen';
import {Root_LocationSearchByMapScreen} from '@atb/stacks-hierarchy/Root_LocationSearchByMapScreen';
import {Root_ScanQrCodeScreen} from '@atb/stacks-hierarchy/Root_ScanQrCodeScreen';
import {Root_LocationSearchByTextScreen} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Root_PurchaseOverviewScreen} from './Root_PurchaseOverviewScreen';
import {Root_PurchaseConfirmationScreen} from './Root_PurchaseConfirmationScreen';
import {Root_PurchaseFareZonesSearchByMapScreen} from '@atb/stacks-hierarchy/Root_PurchaseFareZonesSearchByMapScreen';
import {Root_PurchaseFareZonesSearchByTextScreen} from '@atb/stacks-hierarchy/Root_PurchaseFareZonesSearchByTextScreen';
import {Root_PurchaseHarborSearchScreen} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/Root_PurchaseHarborSearchScreen';
import {Root_PurchaseAsAnonymousConsequencesScreen} from '@atb/stacks-hierarchy/Root_PurchaseAsAnonymousConsequencesScreen';
import {Root_FareContractDetailsScreen} from '@atb/stacks-hierarchy/Root_FareContractDetailsScreen';
import {Root_ReceiptScreen} from '@atb/stacks-hierarchy/Root_ReceiptScreen';
import {Root_LoginAvailableFareContractWarningScreen} from '@atb/stacks-hierarchy/Root_LoginAvailableFareContractWarningScreen';
import {Root_LoginOptionsScreen} from '@atb/stacks-hierarchy/Root_LoginOptionsScreen';
import {Root_LoginPhoneInputScreen} from '@atb/stacks-hierarchy/Root_LoginPhoneInputScreen';
import {Root_LoginConfirmCodeScreen} from '@atb/stacks-hierarchy/Root_LoginConfirmCodeScreen';
import {Root_LoginRequiredForFareProductScreen} from '@atb/stacks-hierarchy/Root_LoginRequiredForFareProductScreen';
import {Root_ConfirmationScreen} from './Root_ConfirmationScreen';
import {
  LoadingScreen,
  LoadingScreenBoundary,
  useIsLoadingAppState,
} from '@atb/screen-components/loading-screen';
import {
  Root_ParkingViolationsConfirmationScreen,
  Root_ParkingViolationsPhotoScreen,
  Root_ParkingViolationsQrScreen,
  Root_ParkingViolationsSelectScreen,
} from '@atb/stacks-hierarchy/Root_ScooterHelp';
import {Root_NotificationPermissionScreen} from '@atb/stacks-hierarchy/Root_NotificationPermissionScreen';
import {Root_LocationWhenInUsePermissionScreen} from '@atb/stacks-hierarchy/Root_LocationWhenInUsePermissionScreen';
import {useBeaconsContext} from '@atb/modules/beacons';
import {Root_TicketInformationScreen} from './Root_TicketInformationScreen/Root_TicketInformationScreen';
import {Root_ChooseTicketRecipientScreen} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen';
import {screenOptions} from '@atb/stacks-hierarchy/navigation-utils';
import {useOnboardingFlow} from '@atb/modules/onboarding';
import {useRegisterIntercomUser} from '@atb/modules/chat';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {ForceUpdateScreen} from '@atb/screen-components/force-update-screen';
import {compareVersion} from '@atb/utils/compare-version';
import {Root_ScooterHelpScreen} from './Root_ScooterHelp/Root_ScooterHelpScreen';
import {Root_ShmoOnboardingScreen} from './Root_ShmoOnboardingScreen';
import {Root_ContactScooterOperatorScreen} from './Root_ScooterHelp/Root_ContactScooterOperatorScreen';
import {Root_ContactScooterOperatorConfirmationScreen} from './Root_ScooterHelp/Root_ContactScooterOperatorConfirmationScreen';
import {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';
import {parseParamAsInt} from './utils';
import {AnalyticsContextProvider} from '@atb/modules/analytics';
import {Root_ParkingPhotoScreen} from './Root_ParkingPhotoScreen';
import {Root_TripSelectionScreen} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/Root_TripSelectionScreen';
import {useSetupEventStream} from '@atb/modules/event-stream';
import {useSetupReactQueryWindowFocus} from '@atb/queries';
import {
  Root_SmartParkAndRideAddScreen,
  Root_SmartParkAndRideEditScreen,
} from './Root_SmartParkAndRide';
import {Root_BonusOnboardingStack} from './Root_BonusOnboardingStack';

type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const isLoadingAppState = useIsLoadingAppState();
  const {getInitialNavigationContainerState} = useOnboardingFlow();
  const {theme} = useThemeContext();
  const navRef = useNavigationContainerRef<RootStackParamList>();
  const {minimum_app_version} = useRemoteConfigContext();

  useBeaconsContext();
  useTestIds();
  useSetupReactQueryWindowFocus();
  useSetupEventStream();

  // init Intercom user
  useRegisterIntercomUser();

  if (isLoadingAppState) {
    return null;
  }

  const statusBarColor = theme.color.background.accent[0].background;

  const ReactNavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.color.background.neutral[1].background,
    },
  };

  function getResultStateFromPath(path: string): ResultState {
    const params = parse(path);
    const destination: PartialRoute<any>[] = [
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

    if (path.includes('details')) {
      const item: ServiceJourneyDeparture = {
        serviceJourneyId: params.serviceJourneyId as string,
        date: (params.date as string) || new Date().toISOString(),
        serviceDate: params.serviceDate as string,
        fromStopPosition: parseParamAsInt(params.fromStopPosition) || 0,
        toStopPosition: parseParamAsInt(params.toStopPosition),
      };
      destination.push({
        name: 'Departures_DepartureDetailsScreen',
        params: {
          activeItemIndex: 0,
          items: [item],
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
                name: 'TabNav_DeparturesStack',
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

  const isCurrentAppVersionLowerThanMinVersion =
    APP_VERSION &&
    minimum_app_version &&
    compareVersion(APP_VERSION, minimum_app_version) < 0;

  if (isCurrentAppVersionLowerThanMinVersion) return <ForceUpdateScreen />;

  return (
    <>
      <StatusBar
        barStyle={theme.statusBarStyle}
        translucent={true}
        backgroundColor={statusBarColor}
      />
      <Host>
        <LoadingScreenBoundary>
          <NavigationContainer<RootStackParamList>
            onStateChange={trackNavigation}
            initialState={getInitialNavigationContainerState()}
            ref={navRef}
            theme={ReactNavigationTheme}
            fallback={<LoadingScreen />}
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
                              TicketTabNav_AvailableFareContractsTabScreen:
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
                if (path.includes('privacy')) {
                  return {
                    routes: [
                      {
                        name: 'Root_TabNavigatorStack',
                        state: {
                          routes: [
                            {
                              name: 'TabNav_ProfileStack',
                              state: {
                                routes: [
                                  {name: 'Profile_RootScreen'},
                                  {
                                    name: 'Profile_PrivacyScreen',
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
            <AnalyticsContextProvider>
              <Stack.Navigator
                screenOptions={screenOptions(
                  TransitionPresets.ModalSlideFromBottomIOS,
                  {
                    headerShown: false,
                    presentation: 'modal',
                  },
                )}
              >
                <Stack.Screen
                  name="Root_TabNavigatorStack"
                  component={Root_TabNavigatorStack}
                />
                <Stack.Screen
                  name="Root_ExtendedOnboardingStack"
                  component={Root_ExtendedOnboardingStack}
                />
                <Stack.Screen
                  name="Root_ConsiderTravelTokenChangeScreen"
                  component={Root_ConsiderTravelTokenChangeScreen}
                />
                <Stack.Screen
                  name="Root_SelectTravelTokenScreen"
                  component={Root_SelectTravelTokenScreen}
                />
                <Stack.Screen
                  name="Root_LocationSearchByTextScreen"
                  component={Root_LocationSearchByTextScreen}
                />
                <Stack.Screen
                  name="Root_LocationSearchByMapScreen"
                  component={Root_LocationSearchByMapScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_ScanQrCodeScreen"
                  component={Root_ScanQrCodeScreen}
                />
                <Stack.Screen
                  name="Root_PurchaseOverviewScreen"
                  component={Root_PurchaseOverviewScreen}
                />
                <Stack.Screen
                  name="Root_PurchaseConfirmationScreen"
                  component={Root_PurchaseConfirmationScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_PurchaseFareZonesSearchByMapScreen"
                  component={Root_PurchaseFareZonesSearchByMapScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_PurchaseFareZonesSearchByTextScreen"
                  component={Root_PurchaseFareZonesSearchByTextScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_PurchaseHarborSearchScreen"
                  component={Root_PurchaseHarborSearchScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_TripSelectionScreen"
                  component={Root_TripSelectionScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_PurchaseAsAnonymousConsequencesScreen"
                  component={Root_PurchaseAsAnonymousConsequencesScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_FareContractDetailsScreen"
                  component={Root_FareContractDetailsScreen}
                />
                <Stack.Screen
                  name="Root_TicketInformationScreen"
                  component={Root_TicketInformationScreen}
                />
                <Stack.Screen
                  name="Root_ReceiptScreen"
                  component={Root_ReceiptScreen}
                />
                <Stack.Screen
                  name="Root_AddEditFavoritePlaceScreen"
                  component={Root_AddEditFavoritePlaceScreen}
                />
                <Stack.Screen
                  name="Root_SearchFavoritePlaceScreen"
                  component={Root_SearchFavoritePlaceScreen}
                />
                <Stack.Screen
                  name="Root_ShareTravelHabitsScreen"
                  component={Root_ShareTravelHabitsScreen}
                />
                <Stack.Screen
                  name="Root_LoginAvailableFareContractWarningScreen"
                  component={Root_LoginAvailableFareContractWarningScreen}
                />
                <Stack.Screen
                  name="Root_LoginOptionsScreen"
                  component={Root_LoginOptionsScreen}
                />
                <Stack.Screen
                  name="Root_LoginPhoneInputScreen"
                  component={Root_LoginPhoneInputScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_LoginConfirmCodeScreen"
                  component={Root_LoginConfirmCodeScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_LoginRequiredForFareProductScreen"
                  component={Root_LoginRequiredForFareProductScreen}
                />
                <Stack.Screen
                  name="Root_ConfirmationScreen"
                  component={Root_ConfirmationScreen}
                />
                <Stack.Screen
                  name="Root_ScooterHelpScreen"
                  component={Root_ScooterHelpScreen}
                />
                <Stack.Screen
                  name="Root_ShmoOnboardingScreen"
                  component={Root_ShmoOnboardingScreen}
                />
                <Stack.Screen
                  name="Root_ContactScooterOperatorScreen"
                  component={Root_ContactScooterOperatorScreen}
                />
                <Stack.Screen
                  name="Root_ContactScooterOperatorConfirmationScreen"
                  component={Root_ContactScooterOperatorConfirmationScreen}
                />
                <Stack.Screen
                  name="Root_ParkingViolationsSelectScreen"
                  component={Root_ParkingViolationsSelectScreen}
                />
                <Stack.Screen
                  name="Root_ParkingViolationsPhotoScreen"
                  component={Root_ParkingViolationsPhotoScreen}
                />
                <Stack.Screen
                  name="Root_ParkingViolationsQrScreen"
                  component={Root_ParkingViolationsQrScreen}
                />
                <Stack.Screen
                  name="Root_ParkingViolationsConfirmationScreen"
                  component={Root_ParkingViolationsConfirmationScreen}
                />
                <Stack.Screen
                  name="Root_NotificationPermissionScreen"
                  component={Root_NotificationPermissionScreen}
                />
                <Stack.Screen
                  name="Root_LocationWhenInUsePermissionScreen"
                  component={Root_LocationWhenInUsePermissionScreen}
                />
                <Stack.Screen
                  name="Root_ChooseTicketRecipientScreen"
                  component={Root_ChooseTicketRecipientScreen}
                  options={screenOptions(TransitionPresets.SlideFromRightIOS)}
                />
                <Stack.Screen
                  name="Root_ParkingPhotoScreen"
                  component={Root_ParkingPhotoScreen}
                />
                <Stack.Screen
                  name="Root_SmartParkAndRideAddScreen"
                  component={Root_SmartParkAndRideAddScreen}
                />
                <Stack.Screen
                  name="Root_SmartParkAndRideEditScreen"
                  component={Root_SmartParkAndRideEditScreen}
                />
                <Stack.Screen
                  name="Root_BonusOnboardingStack"
                  component={Root_BonusOnboardingStack}
                />
              </Stack.Navigator>
            </AnalyticsContextProvider>
          </NavigationContainer>
        </LoadingScreenBoundary>
      </Host>
    </>
  );
};
