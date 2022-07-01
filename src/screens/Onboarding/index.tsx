import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {ConfirmCodeInOnboardingRouteParams} from '@atb/login/in-onboarding/ConfirmCodeInOnboarding';
import IntercomInfo from '@atb/screens/Onboarding/IntercomInfo';
import {WelcomeScreenWithoutLogin} from '@atb/screens/Onboarding/WelcomeScreen';

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
