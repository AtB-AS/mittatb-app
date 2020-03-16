import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
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
import wrapModalScreen from './modal/wrapModalScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  TabNavigator: undefined;
  LocationSearch: undefined;
};

const {Navigator: ModalNavigator, Screen} = createModalStackNavigator<
  RootStackParamList
>();
const LocationSearchModal = wrapModalScreen(LocationSearch);

const NavigationRoot = () => {
  const {isLoading, onboarded} = useAppState();
  const {theme} = useTheme();

  if (isLoading) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer onStateChange={trackNavigation}>
        <ModalNavigator mode={!onboarded ? 'card' : 'modal'}>
          {!onboarded ? (
            <Screen
              name="Onboarding"
              component={Onboarding}
              options={{headerShown: false}}
            />
          ) : (
            <>
              <Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{headerShown: false}}
              />
              <Screen
                name="LocationSearch"
                component={LocationSearchModal}
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
                }}
              />
            </>
          )}
        </ModalNavigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default NavigationRoot;
