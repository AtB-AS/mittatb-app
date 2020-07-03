import React, {useEffect, useRef} from 'react';
import {View, StatusBar, Platform, Text} from 'react-native';
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
import {Close} from '../assets/svg/icons/actions';
import {useTheme} from '../theme';
import transitionSpec from './transitionSpec';
import TripDetailsModal, {
  RouteParams as TripDetailsModalParams,
} from '../screens/TripDetailsModal';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from '../screens/TripDetailsModal/DepartureDetails';
import {Host} from 'react-native-portalize';
import {LinkingOptions} from '@react-navigation/native/lib/typescript/src/types';

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
    config: {Profile: 'profile', PaymentVipps: 'payment'},
  });

  useEffect(() => {
    getInitialState()
      .then((state) => {})
      .catch(() => {});
  }, [getInitialState]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle={Platform.select({
          ios: 'dark-content',
          android: 'light-content',
        })}
      />
      <NavigationContainer ref={ref} onStateChange={trackNavigation}>
        <Host>
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
                    title: 'Søk',
                    headerBackTitleVisible: false,
                    headerTintColor: theme.text.primary,
                    headerStyle: {
                      backgroundColor: theme.background.level2,
                      shadowColor: 'transparent',
                    },
                    headerBackImage: ({tintColor}) => (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          alignContent: 'center',
                          justifyContent: 'center',
                          marginLeft: 24,
                        }}
                      >
                        <Close fill={tintColor} />
                      </View>
                    ),
                    transitionSpec: {
                      open: transitionSpec,
                      close: transitionSpec,
                    },
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </Host>
      </NavigationContainer>
    </>
  );
};

export default NavigationRoot;
