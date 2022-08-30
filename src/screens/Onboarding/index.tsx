import {PageIndicator} from '@atb/components/page-indicator';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import ConsequencesScreen from '@atb/screens/AnonymousTicketPurchase/ConsequencesScreen';
import IntercomInfo from '@atb/screens/Onboarding/IntercomInfo';
import {WelcomeScreenWithoutLogin} from '@atb/screens/Onboarding/WelcomeScreen';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OnboardingStackParams} from './types';

const Tab = createMaterialTopTabNavigator<OnboardingStackParams>();
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export default function Index() {
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
          initialRouteName="WelcomeScreenWithoutLogin"
        >
          <Tab.Screen
            name="WelcomeScreenWithoutLogin"
            component={WelcomeScreenWithoutLogin}
          />
          <Tab.Screen name="IntercomInfo" component={IntercomInfo} />
          {enable_ticketing && (
            <Tab.Screen
              name="ConsequencesFromOnboarding"
              component={ConsequencesScreen}
            />
          )}
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
