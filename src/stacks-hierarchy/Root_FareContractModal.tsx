import {
  CarnetDetailsScreen,
  DetailsScreen,
  ReceiptScreen,
} from '@atb/fare-contracts/Details';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  FareContractModalStackParams,
  FareContractModalStackRootProps,
} from '../fare-contracts/Details/types';

const Stack = createStackNavigator<FareContractModalStackParams>();

export const Root_FareContractModal = ({}: FareContractModalStackRootProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="FareContractDetails" component={DetailsScreen} />
      <Stack.Screen
        name="CarnetDetailsScreen"
        component={CarnetDetailsScreen}
      />
      <Stack.Screen name="PurchaseReceipt" component={ReceiptScreen} />
    </Stack.Navigator>
  );
};
