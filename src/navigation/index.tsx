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

export type RootStackParamList = {
  NotFound: undefined;
  Onboarding: undefined;
  TabNavigator: undefined;
  LocationSearch: LocationSearchParams;
  TripDetailsModal: TripDetailsModalParams;
  DepartureDetailsModal: DepartureDetailsRouteParams;
};

const Stack = createStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();
  const {theme} = useTheme();

  const ref = useRef<NavigationContainerRef>(null);
  const {getInitialState} = useLinking(ref, {
    prefixes: ['atb://'],
    config: {screens: {Profile: 'profile', PaymentVipps: 'payment'}},
  });

  useEffect(() => {
    getInitialState().then(
      (state) => {},
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
          <Stack.Navigator mode={isLoading || !onboarded ? 'card' : 'modal'}>
            {!onboarded ? (
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
                  name="TripDetailsModal"
                  component={TripDetailsModal}
                  options={{
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardShadowEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                  }}
                />
                <Stack.Screen
                  name="DepartureDetailsModal"
                  component={DepartureDetails}
                  options={{
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardShadowEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                  }}
                />
                <Stack.Screen
                  name="LocationSearch"
                  component={LocationSearch}
                  options={{
                    headerShown: false,
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
