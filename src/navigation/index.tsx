import React from 'react';
import {View} from 'react-native';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import trackNavigation from '../diagnostics/trackNavigation';
import {useAppState} from '../AppContext';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import LocationSearch from '../location-search';
import TabNavigator from './TabNavigator';
import CloseModalCrossIcon from './svg/CloseModalCrossIcon';
import {useTheme} from '../theme';
import createModalStackNavigator from './modal/createModalStackNavigator';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import transitionSpec from './transitionSpec';

export type RootStackParamList = {
  TabNavigator: undefined;
  LocationSearch: undefined;
};

const {
  Navigator: ModalNavigator,
  Screen,
  useUniqueModal,
  useOpenModal: useOpenModalInternal,
} = createModalStackNavigator();

const LocationSearchModal = wrapModalScreen(LocationSearch);

export const useOpenModal = useOpenModalInternal;

const SharedStack = createSharedElementStackNavigator<RootStackParamList>();

const Root = () => {
  const {theme} = useTheme();
  return (
    <SharedStack.Navigator mode="modal">
      <SharedStack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <SharedStack.Screen
        name="LocationSearch"
        component={LocationSearchModal}
        sharedElementsConfig={() => [
          {id: 'locationSearchInput', animation: 'move'},
        ]}
        options={{
          title: 'Søk',
          headerBackTitleVisible: false,
          headerTintColor: theme.text.primary,
          headerStyle: {
            backgroundColor: theme.background.secondary,
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
    </SharedStack.Navigator>
  );
};

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();
  if (isLoading) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer onStateChange={trackNavigation}>
        <ModalNavigator mode="card" headerMode="none">
          {!onboarded ? (
            <Screen name="Onboarding" component={Onboarding} />
          ) : (
            <Screen name="Root" component={Root} />
          )}
        </ModalNavigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

type ModalScreenProps = {
  route: any;
  navigation: NavigationProp<any, any>;
};

function wrapModalScreen(Component: React.ComponentType<any>) {
  const ModalScreen: React.FC<ModalScreenProps> = ({route, navigation}) => {
    const {uniqueModalId} = route.params;
    const {state, onCloseModal} = useUniqueModal(uniqueModalId);
    React.useEffect(() => {
      return () => onCloseModal(uniqueModalId);
    }, []);
    return <Component {...state} navigation={navigation} />;
  };
  return ModalScreen;
}

export default NavigationRoot;
