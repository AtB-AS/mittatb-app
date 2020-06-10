import React from 'react';
import {View, StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import trackNavigation from '../diagnostics/trackNavigation';
import {useAppState} from '../AppContext';
import Onboarding from '../screens/Onboarding';
import LocationSearch, {
  RouteParams as LocationSearchParams,
} from '../location-search';
import TabNavigator from './TabNavigator';
import CloseModalCrossIcon from './svg/CloseModalCrossIcon';
import {useTheme} from '../theme';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import transitionSpec from './transitionSpec';
import TripDetailsModal, {
  RouteParams as TripDetailsModalParams,
} from '../screens/TripDetailsModal';
import {TransitionPresets} from '@react-navigation/stack';
import DepartureDetails, {
  DepartureDetailsRouteParams,
} from '../screens/TripDetailsModal/DepartureDetails';
import {Host} from 'react-native-portalize';

export type RootStackParamList = {
  Onboarding: undefined;
  TabNavigator: undefined;
  LocationSearch: LocationSearchParams;
  TripDetailsModal: TripDetailsModalParams;
  DepartureDetailsModal: DepartureDetailsRouteParams;
};

const SharedStack = createSharedElementStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();
  const {theme} = useTheme();

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={Platform.select({
          ios: 'dark-content',
          android: 'light-content',
        })}
      />
      <NavigationContainer onStateChange={trackNavigation}>
        <Host>
          <SharedStack.Navigator
            mode={isLoading || !onboarded ? 'card' : 'modal'}
          >
            {!onboarded ? (
              <SharedStack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{headerShown: false}}
              />
            ) : (
              <>
                <SharedStack.Screen
                  name="TabNavigator"
                  component={TabNavigator}
                  options={{headerShown: false}}
                />
                <SharedStack.Screen
                  name="TripDetailsModal"
                  component={TripDetailsModal}
                  options={{
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardShadowEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                  }}
                />
                <SharedStack.Screen
                  name="DepartureDetailsModal"
                  component={DepartureDetails}
                  options={{
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardShadowEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                  }}
                />
                <SharedStack.Screen
                  name="LocationSearch"
                  component={LocationSearch}
                  sharedElementsConfig={() => [
                    {
                      id: 'locationSearchInput',
                      animation: 'fade',
                      resize: 'clip',
                      align: 'center-bottom',
                    },
                  ]}
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
                        <CloseModalCrossIcon fill={tintColor} />
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
          </SharedStack.Navigator>
        </Host>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default NavigationRoot;
