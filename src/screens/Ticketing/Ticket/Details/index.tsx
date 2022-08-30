import CarnetDetailsScreen from '@atb/screens/Ticketing/Ticket/Details/CarnetDetailsScreen';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import DetailsScreen from './DetailsScreen';
import ReceiptScreen from './ReceiptScreen';
import {TicketModalStackParams, TicketModalStackRootProps} from './types';

const Stack = createStackNavigator<TicketModalStackParams>();

const TicketModalRoot = ({}: TicketModalStackRootProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TicketDetails" component={DetailsScreen} />
      <Stack.Screen
        name="CarnetDetailsScreen"
        component={CarnetDetailsScreen}
      />
      <Stack.Screen name="TicketReceipt" component={ReceiptScreen} />
    </Stack.Navigator>
  );
};

export default TicketModalRoot;
