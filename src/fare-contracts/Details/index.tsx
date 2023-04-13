import {CarnetDetailsScreen} from '@atb/fare-contracts/Details/CarnetDetailsScreen';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {DetailsScreen} from './DetailsScreen';
import {ReceiptScreen} from './ReceiptScreen';
import {
  FareContractModalStackParams,
  FareContractModalStackRootProps,
} from './types';

const Stack = createStackNavigator<FareContractModalStackParams>();

export const FareContractModalRoot = ({}: FareContractModalStackRootProps) => {
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
