import {useAppState} from '@atb/AppContext';
import trackNavigation from '@atb/diagnostics/trackNavigation';
import LocationSearch, {
  RouteParams as LocationSearchParams,
} from '@atb/location-search';
import LoginInAppStack, {
  LoginInAppStackParams,
} from '@atb/login/in-app/LoginInAppStack';
import ConsequencesScreen from '@atb/screens/AnonymousTicketPurchase/ConsequencesScreen';
import MobileTokenOnboarding from '@atb/screens/MobileTokenOnboarding';
import Onboarding from '@atb/screens/Onboarding';
import AddEditFavorite, {
  AddEditFavoriteRootParams,
} from '@atb/screens/Profile/AddEditFavorite';
import SortableFavoriteList from '@atb/screens/Profile/FavoriteList/SortFavorites';
import SelectTravelTokenScreen from '@atb/screens/Profile/TravelToken/SelectTravelTokenScreen';
import TicketPurchase, {
  TicketingStackParams,
} from '@atb/screens/Ticketing/Purchase';
import TicketModalScreen, {
  TicketModalStackParams,
} from '@atb/screens/Ticketing/Ticket/Details';
import {useTheme} from '@atb/theme';
import {APP_SCHEME} from '@env';
import {
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {StatusBar} from 'react-native';
import {Host} from 'react-native-portalize';
import TabNavigator, {TabNavigatorParams} from './TabNavigator';
import transitionSpec from './transitionSpec';
import useTestIds from './use-test-ids';

export type RootStackParamList = {
  NotFound: undefined;
  Onboarding: undefined;
  TabNavigator: NavigatorScreenParams<TabNavigatorParams>;
  LocationSearch: LocationSearchParams;
  SortableFavoriteList: undefined;
  AddEditFavorite: NavigatorScreenParams<AddEditFavoriteRootParams>;
  LoginInApp: NavigatorScreenParams<LoginInAppStackParams>;
  TicketPurchase: NavigatorScreenParams<TicketingStackParams>;
  TicketModal: NavigatorScreenParams<TicketModalStackParams>;
  MobileTokenOnboarding: undefined;
  SelectTravelTokenRoot: undefined;
  ConsequencesFromTicketPurchase: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();
  const {theme} = useTheme();

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
                    Ticketing: {
                      screens: {ActiveTickets: 'ticketing'},
                    },
                  },
                },
              },
            },
          }}
        >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              presentation: isLoading || !onboarded ? 'card' : 'modal',
            }}
          >
            {!onboarded ? (
              <>
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="LoginInApp" component={LoginInAppStack} />
              </>
            ) : (
              <>
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
                <Stack.Screen
                  name="ConsequencesFromTicketPurchase"
                  component={ConsequencesScreen}
                />
                <Stack.Screen
                  name="LocationSearch"
                  component={LocationSearch}
                  options={TransitionPresets.ModalSlideFromBottomIOS}
                />
                <Stack.Screen
                  name="TicketPurchase"
                  component={TicketPurchase}
                />
                <Stack.Screen
                  name="TicketModal"
                  component={TicketModalScreen}
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
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Host>
    </>
  );
};

export default NavigationRoot;
