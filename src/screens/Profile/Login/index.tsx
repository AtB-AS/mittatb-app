import {CompositeNavigationProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import PhoneInput from '@atb/screens/Profile/Login/PhoneInput';
import ConfirmCode, {
  ConfirmCodeRouteParams,
} from '@atb/screens/Profile/Login/ConfirmCode';
import {ProfileStackParams} from '@atb/screens/Profile';

export type LoginRootParams = {
  PhoneInput: undefined;
  ConfirmCode: ConfirmCodeRouteParams;
};

export type LoginNavigationProp = CompositeNavigationProp<
  StackNavigationProp<LoginRootParams>,
  StackNavigationProp<ProfileStackParams>
>;

const Stack = createStackNavigator<LoginRootParams>();

export default function Login() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="PhoneInput"
    >
      <Stack.Screen name="PhoneInput" component={PhoneInput} />
      <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
    </Stack.Navigator>
  );
}
