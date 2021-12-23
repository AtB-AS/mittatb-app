import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {useAuthState} from '../auth';
import {Reservation, FareContract, PaymentStatus} from './types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {TokenStatus} from '@entur/react-native-traveller/lib/typescript/token/types';
import {CustomerProfile} from '.';
import setupFirestoreListener from './firestore';

type TicketReducerState = {
  fareContracts: FareContract[];
  reservations: Reservation[];
  isRefreshingTickets: boolean;
  errorRefreshingTickets: boolean;
  tokenStatus?: TokenStatus;
  customerProfile: CustomerProfile | undefined;
  didPaymentFail: boolean;
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
      type: 'UPDATE_FARE_CONTRACT_TICKETS';
      fareContracts: FareContract[];
    }
  | {
      type: 'UPDATE_CUSTOMER_PROFILE';
      customerProfile: CustomerProfile | undefined;
    }
  | {
      type: 'SET_TOKEN_STATUS';
      tokenStatus: TokenStatus;
    }
  | {
      type: 'UPDATE_PAYMENT_FAILED';
      didPaymentFail: boolean;
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
    case 'SET_TOKEN_STATUS': {
      return {
        ...prevState,
        tokenStatus: action.tokenStatus,
      };
    }
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
      return {
        ...prevState,
        fareContracts: action.fareContracts,
        isRefreshingTickets: false,
      };
    }
    case 'UPDATE_RESERVATIONS': {
      return {
        ...prevState,
        reservations: action.reservations,
      };
    }
    case 'UPDATE_CUSTOMER_PROFILE': {
      return {
        ...prevState,
        customerProfile: action.customerProfile,
      };
    }
    case 'UPDATE_PAYMENT_FAILED': {
      return {
        ...prevState,
        didPaymentFail: action.didPaymentFail,
      };
    }
  }
};

type TicketState = {
  refreshTickets: () => void;
  fareContracts: FareContract[];
  didPaymentFail: boolean;
  resetPaymentStatus: () => void;
  findFareContractByOrderId: (id: string) => FareContract | undefined;
} & Pick<
  TicketReducerState,
  'reservations' | 'isRefreshingTickets' | 'tokenStatus' | 'customerProfile'
>;

const initialReducerState: TicketReducerState = {
  tokenStatus: undefined,
  fareContracts: [],
  reservations: [],
  isRefreshingTickets: false,
  errorRefreshingTickets: false,
  customerProfile: undefined,
  didPaymentFail: false,
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
            dispatch({type: 'UPDATE_RESERVATIONS', reservations}),
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
  const resetPaymentStatus = () => {
    dispatch({
      type: 'UPDATE_PAYMENT_FAILED',
      didPaymentFail: false,
    });
  };

  return (
    <TicketContext.Provider
      value={{
        ...state,
        refreshTickets,
        resetPaymentStatus,
        findFareContractByOrderId: (orderId) =>
          state.fareContracts.find((fc) => fc.orderId === orderId),
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

function isHandledPaymentStatus(status: PaymentStatus | undefined): boolean {
  switch (status) {
    case 'CANCEL':
    case 'CREDIT':
    case 'REJECT':
      return true;
    default:
      return false;
  }
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
