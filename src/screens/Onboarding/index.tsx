import React from 'react';
import {ConfirmCodeInOnboardingRouteParams} from '@atb/login/in-onboarding/ConfirmCodeInOnboarding';
import IntercomInfo from '@atb/screens/Onboarding/IntercomInfo';
import {WelcomeScreenWithoutLogin} from '@atb/screens/Onboarding/WelcomeScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PageIndicator} from '@atb/components/page-indicator';
import {SafeAreaView} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';

export type OnboardingStackParams = {
  WelcomeScreenLogin: undefined;
  WelcomeScreenWithoutLogin: undefined;
  IntercomInfo: undefined;
  PhoneInputInOnboarding: undefined;
  ConfirmCodeInOnboarding: ConfirmCodeInOnboardingRouteParams;
  SkipLoginWarning: undefined;
};

const Tab = createMaterialTopTabNavigator<OnboardingStackParams>();
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export default function Index() {
  const styles = useStyles();
  return (
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
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
