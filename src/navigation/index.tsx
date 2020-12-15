import {
  NavigationContainer,
  NavigationContainerRef,
  useLinking,
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {Host} from 'react-native-portalize';
import {useAppState} from '../AppContext';
import trackNavigation from '../diagnostics/trackNavigation';
import LocationSearch, {
  RouteParams as LocationSearchParams,
} from '../location-search';
import TicketPurchase, {
  RouteParams as TicketPurchaseParams,
} from '../screens/Ticketing/Purchase';
import Onboarding from '../screens/Onboarding';
import TripDetailsModal, {
  RouteParams as TripDetailsModalParams,
} from '../screens/TripDetailsModal';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from '../screens/TripDetailsModal/DepartureDetails';
import {useTheme} from '../theme';
import TabNavigator from './TabNavigator';
import transitionSpec from './transitionSpec';
import AddEditFavorite, {
  AddEditParams,
} from '../screens/Profile/AddEditFavorite';
import SortableFavoriteList from '../screens/Profile/FavoriteList/SortFavorites';
import TicketModalScreen, {
  TicketModalRouteParams,
} from '../screens/Ticketing/Ticket/Details';

export type RootStackParamList = {
  NotFound: undefined;
  Onboarding: undefined;
  TabNavigator: undefined;
  LocationSearch: LocationSearchParams;
  TripDetailsModal: TripDetailsModalParams;
  DepartureDetailsModal: DepartureDetailsRouteParams;
  SortableFavoriteList: undefined;
  AddEditFavorite: AddEditParams;
  TicketPurchase: TicketPurchaseParams;
  TicketModal: TicketModalRouteParams;
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
                  name="TripDetailsModal"
                  component={TripDetailsModal}
                  options={{
                    ...TransitionPresets.SlideFromRightIOS,
                  }}
                />
                <Stack.Screen
                  name="DepartureDetailsModal"
                  component={DepartureDetails}
                  options={{
                    cardOverlayEnabled: true,
                    cardShadowEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                  }}
                />
                <Stack.Screen
                  name="LocationSearch"
                  component={LocationSearch}
                  options={{
                    transitionSpec: {
                      open: transitionSpec,
                      close: transitionSpec,
                    },
                  }}
                />
                <Stack.Screen
                  name="TicketPurchase"
                  component={TicketPurchase}
                  options={{
                    transitionSpec: {
                      open: transitionSpec,
                      close: transitionSpec,
                    },
                  }}
                />
                <Stack.Screen
                  name="TicketModal"
                  component={TicketModalScreen}
                  options={{
                    transitionSpec: {
                      open: transitionSpec,
                      close: transitionSpec,
                    },
                  }}
                />

                <Stack.Screen
                  name="AddEditFavorite"
                  component={AddEditFavorite}
                  options={{
                    transitionSpec: {
                      open: transitionSpec,
                      close: transitionSpec,
                    },
                  }}
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
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Host>
    </>
  );
};

export default NavigationRoot;
