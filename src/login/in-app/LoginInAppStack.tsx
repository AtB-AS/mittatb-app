import {ActiveFareContractPromptInApp} from '@atb/login/in-app/ActiveFareContractPrompt';
import {ConfirmCodeInApp} from '@atb/login/in-app/ConfirmCodeInApp';
import {LoginOnboardingInApp} from '@atb/login/in-app/LoginOnboarding';
import {PhoneInputInApp} from '@atb/login/in-app/PhoneInputInApp';
import LoginOptionsScreen from '@atb/login/LoginOptionsScreen';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {LoginInAppStackParams} from '../types';

const Stack = createStackNavigator<LoginInAppStackParams>();

export default function LoginInAppStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ActiveFareContractPromptInApp"
    >
      <Stack.Screen
        name="ActiveFareContractPromptInApp"
        component={ActiveFareContractPromptInApp}
      />
      <Stack.Screen
        name="LoginOnboardingInApp"
        component={LoginOnboardingInApp}
      />
      <Stack.Screen name="LoginOptionsScreen" component={LoginOptionsScreen} />
      <Stack.Screen name="PhoneInputInApp" component={PhoneInputInApp} />
      <Stack.Screen name="ConfirmCodeInApp" component={ConfirmCodeInApp} />
    </Stack.Navigator>
  );
}
