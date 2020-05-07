import React, {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import TicketsScreen from './Tickets';
import OfferScreen from './Offer';
import {
  Method as PaymentMethodScreen,
  CreditCard as CreditCardScreen,
} from './Payment';
import {createStackNavigator} from '@react-navigation/stack';
import {ReserveTicketResponse, FareContract} from '../../api/fareContracts';
import usePollableResource from '../../utils/use-pollable-resource';
import {listFareContracts} from '../../api';

export type TicketingStackParams = {
  Tickets: undefined;
  Offer: undefined;
  PaymentMethod: undefined;
  PaymentCreditCard: ReserveTicketResponse;
};

type TicketState = {
  fareContracts: FareContract[] | undefined;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  pollUntilNewTickets: () => void;
};

const Stack = createStackNavigator<TicketingStackParams>();
const TicketContext = createContext<TicketState | undefined>(undefined);

export default function Ticketing() {
  const [poll, setPoll] = useState(false);

  const getFareContracts = useCallback(async function () {
    try {
      const {fare_contracts} = await listFareContracts();
      return fare_contracts;
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const [
    fareContracts,
    refreshTickets,
    isRefreshingTickets,
  ] = usePollableResource(getFareContracts, {
    initialValue: [],
    pollingTimeInSeconds: 3,
    disabled: !poll,
  });

  useEffect(() => setPoll(false), [fareContracts?.length]);

  return (
    <TicketContext.Provider
      value={{
        fareContracts,
        refreshTickets,
        isRefreshingTickets,
        pollUntilNewTickets: () => setPoll(true),
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Tickets" component={TicketsScreen} />
        <Stack.Screen name="Offer" component={OfferScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
      </Stack.Navigator>
    </TicketContext.Provider>
  );
}

export function useTicketState() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTicketState must be used within a TicketContext');
  }
  return context;
}
