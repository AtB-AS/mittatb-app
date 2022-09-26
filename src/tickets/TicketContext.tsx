import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {useAuthState} from '../auth';
import {Reservation, FareContract, PaymentStatus} from './types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {differenceInMinutes} from 'date-fns';
import {CustomerProfile} from '.';
import setupFirestoreListener from './firestore';

type TicketReducerState = {
  fareContracts: FareContract[];
  reservations: Reservation[];
  rejectedReservations: Reservation[];
  isRefreshingTickets: boolean;
  errorRefreshingTickets: boolean;
  customerProfile: CustomerProfile | undefined;
};

type TicketReducerAction =
  | {type: 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS'}
  | {type: 'SET_ERROR_REFRESHING_FARE_CONTRACT_TICKETS'}
  | {
      type: 'UPDATE_FARE_CONTRACT_TICKETS';
      fareContracts: FareContract[];
    }
  | {
      type: 'UPDATE_RESERVATIONS';
      reservations: Reservation[];
    }
  | {
      type: 'UPDATE_REJECTED_RESERVATIONS';
      rejectedReservations: Reservation[];
    }
  | {
      type: 'UPDATE_CUSTOMER_PROFILE';
      customerProfile: CustomerProfile | undefined;
    };

type TicketReducer = (
  prevState: TicketReducerState,
  action: TicketReducerAction,
) => TicketReducerState;

const ticketReducer: TicketReducer = (
  prevState,
  action,
): TicketReducerState => {
  switch (action.type) {
    case 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS': {
      return {
        ...prevState,
        isRefreshingTickets: true,
        errorRefreshingTickets: false,
      };
    }
    case 'SET_ERROR_REFRESHING_FARE_CONTRACT_TICKETS': {
      return {
        ...prevState,
        isRefreshingTickets: false,
        errorRefreshingTickets: true,
      };
    }
    case 'UPDATE_FARE_CONTRACT_TICKETS': {
      const currentFareContractOrderIds = action.fareContracts.map(
        (fc) => fc.orderId,
      );
      return {
        ...prevState,
        fareContracts: action.fareContracts,
        reservations: prevState.reservations.filter(
          (r) => !currentFareContractOrderIds.includes(r.orderId),
        ),
        isRefreshingTickets: false,
      };
    }
    case 'UPDATE_RESERVATIONS': {
      const currentFareContractOrderIds = prevState.fareContracts.map(
        (fc) => fc.orderId,
      );
      return {
        ...prevState,
        reservations: action.reservations.filter(
          (r) => !currentFareContractOrderIds.includes(r.orderId),
        ),
      };
    }
    case 'UPDATE_REJECTED_RESERVATIONS': {
      const currentFareContractOrderIds = prevState.fareContracts.map(
        (fc) => fc.orderId,
      );
      return {
        ...prevState,
        rejectedReservations: action.rejectedReservations.filter(
          (r) => !currentFareContractOrderIds.includes(r.orderId),
        ),
      };
    }
    case 'UPDATE_CUSTOMER_PROFILE': {
      return {
        ...prevState,
        customerProfile: action.customerProfile,
      };
    }
  }
};

type TicketState = {
  refreshTickets: () => void;
  fareContracts: FareContract[];
  findFareContractByOrderId: (id: string) => FareContract | undefined;
} & Pick<
  TicketReducerState,
  | 'reservations'
  | 'isRefreshingTickets'
  | 'customerProfile'
  | 'rejectedReservations'
>;

const initialReducerState: TicketReducerState = {
  fareContracts: [],
  reservations: [],
  rejectedReservations: [],
  isRefreshingTickets: false,
  errorRefreshingTickets: false,
  customerProfile: undefined,
};

const TicketContext = createContext<TicketState | undefined>(undefined);

const TicketContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(ticketReducer, initialReducerState);

  const {user, abtCustomerId} = useAuthState();
  const {enable_ticketing} = useRemoteConfig();

  useEffect(() => {
    if (user && abtCustomerId && enable_ticketing) {
      const removeListeners = setupFirestoreListener(abtCustomerId, {
        fareContracts: {
          onSnapshot: (fareContracts) =>
            dispatch({type: 'UPDATE_FARE_CONTRACT_TICKETS', fareContracts}),
          onError: () =>
            dispatch({type: 'SET_ERROR_REFRESHING_FARE_CONTRACT_TICKETS'}),
        },
        reservations: {
          onSnapshot: (reservations) =>
            dispatch({
              type: 'UPDATE_RESERVATIONS',
              reservations: reservations.filter(
                (r) =>
                  !!r.paymentStatus &&
                  !isAbortedPaymentStatus(r.paymentStatus) &&
                  !isOlderThanAnHour(r.created.toDate()),
              ),
            }),
          onError: (err) => console.error(err),
        },
        rejectedReservations: {
          onSnapshot: (rejectedReservations) =>
            dispatch({
              type: 'UPDATE_REJECTED_RESERVATIONS',
              rejectedReservations: rejectedReservations,
            }),
          onError: (err) => console.error(err),
        },
        // TODO: Temporary hack to get travelcard ID before we have tokens. Should be
        // replaced when tokens are implemented.
        customer: {
          onSnapshot: (customerProfile) =>
            dispatch({type: 'UPDATE_CUSTOMER_PROFILE', customerProfile}),
          onError: (err) => console.error(err),
        },
      });

      // Stop listening for updates when no longer required
      return () => removeListeners();
    }
  }, [user, abtCustomerId, enable_ticketing]);

  const refreshTickets = () => {};

  return (
    <TicketContext.Provider
      value={{
        ...state,
        refreshTickets,
        findFareContractByOrderId: (orderId) =>
          state.fareContracts.find((fc) => fc.orderId === orderId),
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

function isOlderThanAnHour(date: Date): boolean {
  return differenceInMinutes(new Date(), date) > 60;
}

const abortedPaymentStatus: PaymentStatus[] = ['CANCEL', 'CREDIT'];

function isAbortedPaymentStatus(status: PaymentStatus): boolean {
  return abortedPaymentStatus.includes(status);
}

export function useTicketState() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error(
      'useTicketState must be used within a TicketContextProvider',
    );
  }
  return context;
}

export default TicketContextProvider;
