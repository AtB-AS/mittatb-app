import {useAppState} from '@atb/AppContext';
import trackNavigation from '@atb/diagnostics/trackNavigation';
import LocationSearch, {
  RouteParams as LocationSearchParams,
} from '@atb/location-search';
import Onboarding from '@atb/screens/Onboarding';
import AddEditFavorite, {
  AddEditFavoriteRootParams,
} from '@atb/screens/Profile/AddEditFavorite';
import SortableFavoriteList from '@atb/screens/Profile/FavoriteList/SortFavorites';
import TicketPurchase, {
  TicketingStackParams,
} from '@atb/screens/Ticketing/Purchase';
import TicketModalScreen, {
  TicketModalStackParams,
} from '@atb/screens/Ticketing/Ticket/Details';
import {useTheme} from '@atb/theme';
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigatorScreenParams,
  useLinking,
  DefaultTheme,
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {Host} from 'react-native-portalize';
import TabNavigator, {TabNavigatorParams} from './TabNavigator';
import transitionSpec from './transitionSpec';
import LoginInAppStack, {
  LoginInAppStackParams,
} from '@atb/login/in-app/LoginInAppStack';
import useTestIds from './use-test-ids';
import MobileTokenOnboardingStack from '@atb/login/mobile-token-onboarding/MobileTokenOnboardingStack';
import {useAuthState} from '@atb/auth';
import SelectTravelTokenScreen from '@atb/screens/Profile/TravelToken/SelectTravelTokenScreen';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {shouldOnboardMobileToken} from '@atb/api/utils';

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
  MobileTokenOnboardingStack: undefined;
  SelectTravelToken: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const {isLoading, onboarded, mobileTokenOnboarded} = useAppState();
  const {theme} = useTheme();
  const {authenticationType} = useAuthState();
  const hasEnabledMobileToken = useHasEnabledMobileToken();

  useTestIds();

  const ref = useRef<NavigationContainerRef>(null);
  const {getInitialState} = useLinking(ref, {
    prefixes: ['atb://'],
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
  });

  useEffect(() => {
    getInitialState().then(
      () => {},
      () => {},
    );
  }, [getInitialState]);

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
        <NavigationContainer
          ref={ref}
          onStateChange={trackNavigation}
          theme={ReactNavigationTheme}
        >
          <Stack.Navigator
            mode={isLoading || !onboarded ? 'card' : 'modal'}
            screenOptions={{headerShown: false}}
          >
            {!onboarded ? (
              <Stack.Screen name="Onboarding" component={Onboarding} />
            ) : shouldOnboardMobileToken(
                hasEnabledMobileToken,
                authenticationType,
                mobileTokenOnboarded,
              ) ? (
              <>
                <Stack.Screen
                  name="MobileTokenOnboardingStack"
                  component={MobileTokenOnboardingStack}
                />
                <Stack.Screen
                  name="SelectTravelToken"
                  component={SelectTravelTokenScreen}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
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
                  name="AddEditFavorite"
                  component={AddEditFavorite}
                  options={TransitionPresets.ModalSlideFromBottomIOS}
                />
                <Stack.Screen
                  name="SortableFavoriteList"
                  component={SortableFavoriteList}
                  options={{
                    gestureResponseDistance: {
                      vertical: 100,
                    },
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
