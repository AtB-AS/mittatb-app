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

export type LoginInAppStackParams = {
  PhoneInputInApp: PhoneInputInAppRouteParams;
  ConfirmCodeInApp: ConfirmCodeInAppRouteParams;
};

const Stack = createStackNavigator<LoginInAppStackParams>();

export default function LoginInAppStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="PhoneInputInApp"
    >
      <Stack.Screen name="PhoneInputInApp" component={PhoneInputInApp} />
      <Stack.Screen name="ConfirmCodeInApp" component={ConfirmCodeInApp} />
    </Stack.Navigator>
  );
}
