import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {useAuthContext} from '../auth';
import {Reservation, PaymentStatus} from './types';
import {FareContractType} from '@atb-as/utils';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {differenceInMinutes} from 'date-fns';
import {CustomerProfile} from '.';
import {setupFirestoreListeners} from './firestore';
import {logToBugsnag, notifyBugsnag} from '@atb/utils/bugsnag-utils';

type TicketingReducerState = {
  fareContracts: FareContractType[];
  sentFareContracts: FareContractType[];
  reservations: Reservation[];
  rejectedReservations: Reservation[];
  isRefreshingFareContracts: boolean;
  customerProfile: CustomerProfile | undefined;
};

type TicketingReducerAction =
  | {
      type: 'UPDATE_FARE_CONTRACTS';
      fareContracts: FareContractType[];
    }
  | {
      type: 'UPDATE_SENT_FARE_CONTRACTS';
      fareContracts: FareContractType[];
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
    case 'UPDATE_FARE_CONTRACTS': {
      const currentFareContractOrderIds = action.fareContracts.map(
        (fc) => fc.orderId,
      );
      const fareContracts = action.fareContracts.filter(
        (fc) => FareContractType.safeParse(fc).success,
      );
      return {
        ...prevState,
        fareContracts,
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
      const sentToOthersFareContractOrderIds = prevState.sentFareContracts.map(
        (fc) => fc.orderId,
      );
      const combinedOrderIds = [
        ...currentFareContractOrderIds,
        ...sentToOthersFareContractOrderIds,
      ];
      return {
        ...prevState,
        reservations: action.reservations.filter(
          (r) => !combinedOrderIds.includes(r.orderId),
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
  fareContracts: FareContractType[];
  sentFareContracts: FareContractType[];
  findFareContractById: (id: string) => FareContractType | undefined;
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
  customerProfile: undefined,
};

type Props = {
  children: React.ReactNode;
};

const TicketingContext = createContext<TicketingState | undefined>(undefined);
export const TicketingContextProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(ticketingReducer, initialReducerState);

  const {userId} = useAuthContext();
  const {enable_ticketing} = useRemoteConfigContext();

  useEffect(() => {
    if (userId && enable_ticketing) {
      logToBugsnag(
        `Setting up ticketing Firestore listeners for user ${userId}`,
      );
      const removeListeners = setupFirestoreListeners(userId, {
        fareContracts: {
          onSnapshot: (fareContracts) =>
            dispatch({type: 'UPDATE_FARE_CONTRACTS', fareContracts}),
          onError: (err) =>
            notifyBugsnag(err, {
              metadata: {
                description:
                  'Error setting up Firestore listener for fare contracts',
              },
            }),
        },
        sentFareContracts: {
          onSnapshot: (fareContracts) =>
            dispatch({type: 'UPDATE_SENT_FARE_CONTRACTS', fareContracts}),
          onError: (err) =>
            notifyBugsnag(err, {
              metadata: {
                description:
                  'Error setting up Firestore listener for sent fare contracts',
              },
            }),
        },
        reservations: {
          onSnapshot: (reservations) =>
            dispatch({
              type: 'UPDATE_RESERVATIONS',
              reservations: reservations.filter(
                (r) =>
                  !!r.paymentStatus &&
                  !isAbortedPaymentStatus(r.paymentStatus) &&
                  !isOlderThanAnHour(r.created),
              ),
            }),
          onError: (err) =>
            notifyBugsnag(err, {
              metadata: {
                description:
                  'Error setting up Firestore listener for reservations',
              },
            }),
        },
        rejectedReservations: {
          onSnapshot: (rejectedReservations) =>
            dispatch({
              type: 'UPDATE_REJECTED_RESERVATIONS',
              rejectedReservations: rejectedReservations,
            }),
          onError: (err) =>
            notifyBugsnag(err, {
              metadata: {
                description:
                  'Error setting up Firestore listener for rejected reservations',
              },
            }),
        },
        // TODO: Temporary hack to get travelcard ID before we have tokens. Should be
        // replaced when tokens are implemented.
        customer: {
          onSnapshot: (customerProfile) =>
            dispatch({type: 'UPDATE_CUSTOMER_PROFILE', customerProfile}),
          onError: (err) =>
            notifyBugsnag(err, {
              metadata: {
                description:
                  'Error setting up Firestore listener for customer profile',
              },
            }),
        },
      });

      // Stop listening for updates when no longer required
      return () => removeListeners();
    }
  }, [userId, enable_ticketing]);

  return (
    <TicketingContext.Provider
      value={{
        ...state,
        findFareContractById: (id) =>
          state.fareContracts
            .concat(state.sentFareContracts)
            .find((fc) => fc.id === id),
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

export function useTicketingContext() {
  const context = useContext(TicketingContext);
  if (context === undefined) {
    throw new Error(
      'useTicketingState must be used within a TicketingContextProvider',
    );
  }
  return context;
}
