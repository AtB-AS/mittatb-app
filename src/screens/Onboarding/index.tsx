import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import SkipLoginWarning from '@atb/login/SkipLoginWarning';
import {
  ConfirmCodeInOnboarding,
  ConfirmCodeInOnboardingRouteParams,
} from '@atb/login/in-onboarding/ConfirmCodeInOnboarding';
import {PhoneInputInOnboarding} from '@atb/login/in-onboarding/PhoneInputInOnboarding';
import WelcomeScreen from '@atb/screens/Onboarding/WelcomeScreen';

export type OnboardingStackParams = {
  WelcomeScreen: undefined;
  PhoneInputInOnboarding: undefined;
  ConfirmCodeInOnboarding: ConfirmCodeInOnboardingRouteParams;
  SkipLoginWarning: undefined;
};

const Stack = createStackNavigator<OnboardingStackParams>();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="WelcomeScreen" headerMode="none">
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen
        name="PhoneInputInOnboarding"
        component={PhoneInputInOnboarding}
      />
      <Stack.Screen
        name="ConfirmCodeInOnboarding"
        component={ConfirmCodeInOnboarding}
      />
      <Stack.Screen name="SkipLoginWarning" component={SkipLoginWarning} />
    </Stack.Navigator>
  );
}
