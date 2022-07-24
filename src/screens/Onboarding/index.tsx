import React from 'react';
import {ConfirmCodeInOnboardingRouteParams} from '@atb/login/in-onboarding/ConfirmCodeInOnboarding';
import IntercomInfo from '@atb/screens/Onboarding/IntercomInfo';
import {WelcomeScreenWithoutLogin} from '@atb/screens/Onboarding/WelcomeScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PageIndicator} from '@atb/components/page-indicator';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import ConsequencesScreen from '@atb/screens/AnonymousTicketPurchase/ConsequencesScreen';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {NavigatorScreenParams} from '@react-navigation/native';

export type OnboardingStackParams = {
  WelcomeScreenLogin: undefined;
  WelcomeScreenWithoutLogin: undefined;
  IntercomInfo: undefined;
  PhoneInputInOnboarding: undefined;
  ConfirmCodeInOnboarding: ConfirmCodeInOnboardingRouteParams;
  SkipLoginWarning: undefined;
  ConsequencesFromOnboarding: undefined;
  LoginInApp: NavigatorScreenParams<LoginInAppStackParams>;
};

const Tab = createMaterialTopTabNavigator<OnboardingStackParams>();
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export default function Index() {
  const styles = useStyles();
  const {theme} = useTheme();
  return (
    <>
      <StatusBar
        backgroundColor={theme.static.background[themeColor].background}
      />
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          tabBar={(props) => {
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
          <Tab.Screen
            name="ConsequencesFromOnboarding"
            component={ConsequencesScreen}
          />
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
