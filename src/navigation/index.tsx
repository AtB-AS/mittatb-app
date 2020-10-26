import React, {useEffect, useRef} from 'react';
import {StatusBar, Platform} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
  useLinking,
} from '@react-navigation/native';
import trackNavigation from '../diagnostics/trackNavigation';
import {useAppState} from '../AppContext';
import Onboarding from '../screens/Onboarding';
import LocationSearch, {
  RouteParams as LocationSearchParams,
} from '../location-search';
import TabNavigator from './TabNavigator';
import transitionSpec from './transitionSpec';
import TripDetailsModal, {
  RouteParams as TripDetailsModalParams,
} from '../screens/TripDetailsModal';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from '../screens/TripDetailsModal/DepartureDetails';
import {Host} from 'react-native-portalize';
import {useTheme} from '../theme';
import DeviceInfo from 'react-native-device-info';

export type RootStackParamList = {
  NotFound: undefined;
  Onboarding: undefined;
  TabNavigator: undefined;
  LocationSearch: LocationSearchParams;
  TripDetailsModal: TripDetailsModalParams;
  DepartureDetailsModal: DepartureDetailsRouteParams;
};

const Stack = createStackNavigator<RootStackParamList>();

const hasNotch = DeviceInfo.hasNotch();
// Use default status bar color when non-notched android.
const isNotchedAndroid = Platform.OS === 'android' && hasNotch;

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
        barStyle={isNotchedAndroid ? 'default' : 'dark-content'}
        backgroundColor={isNotchedAndroid ? undefined : theme.background.accent}
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
