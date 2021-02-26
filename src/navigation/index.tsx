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
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {Host} from 'react-native-portalize';
import TabNavigator from './TabNavigator';
import transitionSpec from './transitionSpec';
import Login, {LoginRootParams} from '@atb/screens/Profile/Login';

export type RootStackParamList = {
  NotFound: undefined;
  Onboarding: undefined;
  TabNavigator: undefined;
  LocationSearch: LocationSearchParams;
  SortableFavoriteList: undefined;
  AddEditFavorite: NavigatorScreenParams<AddEditFavoriteRootParams>;
  Login: NavigatorScreenParams<LoginRootParams>;
  TicketPurchase: NavigatorScreenParams<TicketingStackParams>;
  TicketModal: NavigatorScreenParams<TicketModalStackParams>;
};

const Stack = createStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();
  const {theme} = useTheme();

  const ref = useRef<NavigationContainerRef>(null);
  const {getInitialState} = useLinking(ref, {
    prefixes: ['atb://'],
    config: {screens: {Profile: 'profile', Ticketing: 'vipps'}},
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

  return (
    <>
      <StatusBar
        barStyle={theme.statusBarStyle}
        translucent={true}
        backgroundColor={theme.background.header}
      />
      <Host>
        <NavigationContainer ref={ref} onStateChange={trackNavigation}>
          <Stack.Navigator
            mode={isLoading || !onboarded ? 'card' : 'modal'}
            screenOptions={{headerShown: false}}
          >
            {!onboarded ? (
              <Stack.Screen name="Onboarding" component={Onboarding} />
            ) : (
              <>
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
                <Stack.Screen
                  name="LocationSearch"
                  component={LocationSearch}
                  options={{...TransitionPresets.ModalSlideFromBottomIOS}}
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
                  options={{...TransitionPresets.ModalSlideFromBottomIOS}}
                />
                <Stack.Screen
                  name="SortableFavoriteList"
                  component={SortableFavoriteList}
                  options={{
                    gestureResponseDistance: {
                      vertical: 100,
                    },
                  }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
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
