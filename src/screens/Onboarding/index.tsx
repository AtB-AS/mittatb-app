import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import SkipLoginWarning from '@atb/login/SkipLoginWarning';
import {
  ConfirmCodeInOnboarding,
  ConfirmCodeInOnboardingRouteParams,
} from '@atb/login/in-onboarding/ConfirmCodeInOnboarding';
import {PhoneInputInOnboarding} from '@atb/login/in-onboarding/PhoneInputInOnboarding';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import IntercomInfo from '@atb/screens/Onboarding/IntercomInfo';
import {
  WelcomeScreenLogin,
  WelcomeScreenWithoutLogin,
} from '@atb/screens/Onboarding/WelcomeScreen';
import {ThemeColor} from '@atb/theme/colors';

export type OnboardingStackParams = {
  WelcomeScreenLogin: undefined;
  WelcomeScreenWithoutLogin: undefined;
  IntercomInfo: undefined;
  PhoneInputInOnboarding: undefined;
  ConfirmCodeInOnboarding: ConfirmCodeInOnboardingRouteParams;
  SkipLoginWarning: undefined;
};

const Stack = createStackNavigator<OnboardingStackParams>();

export default function Index() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      {/*{enable_login ? (*/}
      {/*  <>*/}
      {/*    <Stack.Screen*/}
      {/*      name="WelcomeScreenLogin"*/}
      {/*      component={WelcomeScreenLogin}*/}
      {/*    />*/}
      {/*    <Stack.Screen*/}
      {/*      name="PhoneInputInOnboarding"*/}
      {/*      component={PhoneInputInOnboarding}*/}
      {/*    />*/}
      {/*    <Stack.Screen*/}
      {/*      name="ConfirmCodeInOnboarding"*/}
      {/*      component={ConfirmCodeInOnboarding}*/}
      {/*    />*/}
      {/*    <Stack.Screen name="SkipLoginWarning" component={SkipLoginWarning} />*/}
      {/*  </>*/}
      {/*) : (*/}
      <>
        <Stack.Screen
          name="WelcomeScreenWithoutLogin"
          component={WelcomeScreenWithoutLogin}
        />
        <Stack.Screen name="IntercomInfo" component={IntercomInfo} />
      </>
      {/*)}*/}
    </Stack.Navigator>
  );
}
