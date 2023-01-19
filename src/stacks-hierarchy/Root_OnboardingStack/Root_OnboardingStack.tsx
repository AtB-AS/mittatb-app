import {PageIndicator} from '@atb/components/page-indicator';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OnboardingStackParams} from './navigation-types';
import {Onboarding_WelcomeScreen} from './Onboarding_WelcomeScreen';
import {Onboarding_AnonymousPurchaseConsequencesScreen} from './Onboarding_AnonymousPurchaseConsequencesScreen';
import {Onboarding_IntercomInfoScreen} from './Onboarding_IntercomInfoScreen';

const Tab = createMaterialTopTabNavigator<OnboardingStackParams>();
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_OnboardingStack = () => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {enable_ticketing} = useRemoteConfig();
  return (
    <>
      <StatusBar
        backgroundColor={theme.static.background[themeColor].background}
      />
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          tabBar={(props: MaterialTopTabBarProps) => {
            return <PageIndicator {...props} />;
          }}
          tabBarPosition="bottom"
          initialRouteName="Onboarding_WelcomeScreen"
        >
          <Tab.Screen
            name="Onboarding_WelcomeScreen"
            component={Onboarding_WelcomeScreen}
          />
          <Tab.Screen
            name="Onboarding_IntercomInfoScreen"
            component={Onboarding_IntercomInfoScreen}
          />
          {enable_ticketing && (
            <Tab.Screen
              name="Onboarding_AnonymousPurchaseConsequencesScreen"
              component={Onboarding_AnonymousPurchaseConsequencesScreen}
            />
          )}
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
