import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  ConfirmCodeInApp,
  ConfirmCodeInAppRouteParams,
} from '@atb/login/in-app/ConfirmCodeInApp';
import {
  PhoneInputInApp,
  PhoneInputInAppRouteParams,
} from '@atb/login/in-app/PhoneInputInApp';
import {
  LoginOnboardingInApp,
  LoginOnboardingInAppRouteParams,
} from '@atb/login/in-app/LoginOnboarding';
import {
  ActiveTicketPromptInApp,
  ActiveTicketPromptInAppRouteParams,
} from '@atb/login/in-app/ActiveTicketPrompt';
import ConsequencesScreen from '@atb/screens/AnonymousTicketPurchase/ConsequencesScreen';

export type LoginInAppStackParams = {
  LoginOnboardingInApp: LoginOnboardingInAppRouteParams;
  ActiveTicketPromptInApp: ActiveTicketPromptInAppRouteParams;
  PhoneInputInApp: PhoneInputInAppRouteParams;
  ConfirmCodeInApp: ConfirmCodeInAppRouteParams;
  ConsequencesFromLoginOnboarding: undefined;
};

const Stack = createStackNavigator<LoginInAppStackParams>();

export default function LoginInAppStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ActiveTicketPromptInApp"
    >
      <Stack.Screen
        name="ActiveTicketPromptInApp"
        component={ActiveTicketPromptInApp}
      />
      <Stack.Screen
        name="LoginOnboardingInApp"
        component={LoginOnboardingInApp}
      />
      <Stack.Screen name="PhoneInputInApp" component={PhoneInputInApp} />
      <Stack.Screen name="ConfirmCodeInApp" component={ConfirmCodeInApp} />
      <Stack.Screen
        name="ConsequencesFromLoginOnboarding"
        component={ConsequencesScreen}
      />
    </Stack.Navigator>
  );
}
