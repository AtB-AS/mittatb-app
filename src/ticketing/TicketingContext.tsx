import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {useAuthState} from '../auth';
import {Reservation, FareContract, PaymentStatus} from './types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {differenceInMinutes} from 'date-fns';
import {CustomerProfile} from '.';
import {setupFirestoreListeners} from './firestore';
import {useResubscribeToggle} from '@atb/utils/use-resubscribe-toggle';

type TicketingReducerState = {
  fareContracts: FareContract[];
  sentFareContracts: FareContract[];
  reservations: Reservation[];
  rejectedReservations: Reservation[];
  isRefreshingFareContracts: boolean;
  errorRefreshingFareContracts: boolean;
  customerProfile: CustomerProfile | undefined;
};

type TicketingReducerAction =
  | {type: 'SET_ERROR_REFRESHING_FARE_CONTRACTS'}
  | {
      type: 'UPDATE_FARE_CONTRACTS';
      fareContracts: FareContract[];
    }
  | {
      type: 'UPDATE_SENT_FARE_CONTRACTS';
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

type TicketingReducer = (
  prevState: TicketingReducerState,
  action: TicketingReducerAction,
) => TicketingReducerState;

const ticketingReducer: TicketingReducer = (
  prevState,
  action,
): TicketingReducerState => {
  switch (action.type) {
    case 'SET_ERROR_REFRESHING_FARE_CONTRACTS': {
      return {
        ...prevState,
        isRefreshingFareContracts: false,
        errorRefreshingFareContracts: true,
      };
    }
    case 'UPDATE_FARE_CONTRACTS': {
      const currentFareContractOrderIds = action.fareContracts.map(
        (fc) => fc.orderId,
      );
      return {
        ...prevState,
        fareContracts: action.fareContracts,
        reservations: prevState.reservations.filter(
          (r) => !currentFareContractOrderIds.includes(r.orderId),
        ),
        isRefreshingFareContracts: false,
      };
    }
    case 'UPDATE_SENT_FARE_CONTRACTS': {
      const currentFareContractOrderIds = action.fareContracts.map(
        (fc) => fc.orderId,
      );
      return {
        ...prevState,
        sentFareContracts: action.fareContracts,
        reservations: prevState.reservations.filter(
          (r) => !currentFareContractOrderIds.includes(r.orderId),
        ),
        isRefreshingFareContracts: false,
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

type TicketingState = {
  fareContracts: FareContract[];
  sentFareContracts: FareContract[];
  findFareContractByOrderId: (id: string) => FareContract | undefined;
  resubscribeFirestoreListeners: () => void;
} & Pick<
  TicketingReducerState,
  | 'reservations'
  | 'isRefreshingFareContracts'
  | 'customerProfile'
  | 'rejectedReservations'
>;

const initialReducerState: TicketingReducerState = {
  fareContracts: [],
  sentFareContracts: [],
  reservations: [],
  rejectedReservations: [],
  isRefreshingFareContracts: false,
  errorRefreshingFareContracts: false,
  customerProfile: undefined,
};

const TicketingContext = createContext<TicketingState | undefined>(undefined);
export const TicketingContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(ticketingReducer, initialReducerState);
  const {resubscribeToggle, resubscribe} = useResubscribeToggle();

  const {userId} = useAuthState();
  const {enable_ticketing} = useRemoteConfig();

  useEffect(() => {
    if (userId && enable_ticketing) {
      const removeListeners = setupFirestoreListeners(userId, {
        fareContracts: {
          onSnapshot: (fareContracts) =>
            dispatch({type: 'UPDATE_FARE_CONTRACTS', fareContracts}),
          onError: () =>
            dispatch({type: 'SET_ERROR_REFRESHING_FARE_CONTRACTS'}),
        },
        sentFareContracts: {
          onSnapshot: (fareContracts) =>
            dispatch({type: 'UPDATE_SENT_FARE_CONTRACTS', fareContracts}),
          onError: () =>
            dispatch({type: 'SET_ERROR_REFRESHING_FARE_CONTRACTS'}),
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
  }, [resubscribeToggle, userId, enable_ticketing]);

  return (
    <TicketingContext.Provider
      value={{
        ...state,
        findFareContractByOrderId: (orderId) =>
          state.fareContracts
            .concat(state.sentFareContracts)
            .find((fc) => fc.orderId === orderId),
        resubscribeFirestoreListeners: resubscribe,
      }}
    >
      {children}
    </TicketingContext.Provider>
  );
};

function isOlderThanAnHour(date: Date): boolean {
  return differenceInMinutes(new Date(), date) > 60;
}

const abortedPaymentStatus: PaymentStatus[] = ['CANCEL', 'CREDIT'];

function isAbortedPaymentStatus(status: PaymentStatus): boolean {
  return abortedPaymentStatus.includes(status);
}

export function useTicketingState() {
  const context = useContext(TicketingContext);
  if (context === undefined) {
    throw new Error(
      'useTicketingState must be used within a TicketingContextProvider',
    );
  }
  return context;
}
