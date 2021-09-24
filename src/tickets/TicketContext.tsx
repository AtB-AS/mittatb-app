import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import useInterval from '../utils/use-interval';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useAuthState} from '../auth';
import {ActiveReservation, FareContract, PaymentStatus} from './types';
import {getPayment} from './api';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import Bugsnag from '@bugsnag/react-native';
import {getToken, initToken, Token} from '@atb/mobile-token';
import {Platform} from 'react-native';

type TicketReducerState = {
  fareContracts: FareContract[];
  activeReservations: ActiveReservation[];
  isRefreshingTickets: boolean;
  errorRefreshingTickets: boolean;
  token?: Token;
};

type TicketReducerAction =
  | {type: 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS'}
  | {type: 'SET_ERROR_REFRESHING_FARE_CONTRACT_TICKETS'}
  | {
      type: 'UPDATE_FARE_CONTRACT_TICKETS';
      fareContracts: FareContract[];
    }
  | {type: 'ADD_RESERVATION'; reservation: ActiveReservation}
  | {
      type: 'UPDATE_RESERVATIONS';
      activeReservations: ActiveReservation[];
    }
  | {
      type: 'SET_MOBILE_TOKEN';
      token: Token;
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
    case 'SET_MOBILE_TOKEN': {
      return {
        ...prevState,
        token: action.token,
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
      const orderIds = action.fareContracts.map((fc) => fc.orderId);
      return {
        ...prevState,
        activeReservations: prevState.activeReservations.filter(
          (res) => !orderIds.includes(res.reservation.order_id),
        ),
        fareContracts: action.fareContracts,
        isRefreshingTickets: false,
      };
    }
    case 'ADD_RESERVATION': {
      const fareContractAlreadyCreated = prevState.fareContracts.some(
        (f) => f.orderId === action.reservation.reservation.order_id,
      );

      if (fareContractAlreadyCreated) {
        return prevState;
      }

      return {
        ...prevState,
        activeReservations: [
          ...prevState.activeReservations,
          action.reservation,
        ],
      };
    }
    case 'UPDATE_RESERVATIONS': {
      return {
        ...prevState,
        activeReservations: action.activeReservations,
      };
    }
  }
};

type TicketState = {
  addReservation: (reservation: ActiveReservation) => void;
  refreshTickets: () => void;
  fareContracts: FareContract[];
  findFareContractByOrderId: (id: string) => FareContract | undefined;
} & Pick<
  TicketReducerState,
  'activeReservations' | 'isRefreshingTickets' | 'token'
>;

const initialReducerState: TicketReducerState = {
  token: undefined,
  fareContracts: [],
  activeReservations: [],
  isRefreshingTickets: false,
  errorRefreshingTickets: false,
};

const TicketContext = createContext<TicketState | undefined>(undefined);

const TicketContextProvider: React.FC = ({children}) => {
  const [{activeReservations, ...state}, dispatch] = useReducer(
    ticketReducer,
    initialReducerState,
  );

  const {user, abtCustomerId} = useAuthState();
  const {enable_ticketing} = useRemoteConfig();

  useEffect(() => {
    async function ensureToken() {
      let token: Token | undefined = undefined;
      try {
        token = await getToken();
      } catch (err) {
        console.warn(err);
      }

      try {
        if (!token) {
          token = await initToken();
        }

        dispatch({type: 'SET_MOBILE_TOKEN', token});
      } catch (err) {
        console.warn(err);
      }
    }

    if (Platform.OS === 'ios' && user?.phoneNumber) ensureToken();
  }, [dispatch, user?.phoneNumber]);

  useEffect(() => {
    if (user && abtCustomerId && enable_ticketing) {
      const subscriber = firestore()
        .collection('customers')
        .doc(abtCustomerId)
        .collection('fareContracts')
        .orderBy('created', 'desc')
        .onSnapshot(
          (snapshot) => {
            const fareContracts = (snapshot as FirebaseFirestoreTypes.QuerySnapshot<FareContract>).docs.map<FareContract>(
              (d) => d.data(),
            );
            dispatch({type: 'UPDATE_FARE_CONTRACT_TICKETS', fareContracts});

            Bugsnag.leaveBreadcrumb('snapshot_fetched', {
              count: fareContracts.length,
            });
          },
          (err) => {
            Bugsnag.notify(err, function (event) {
              event.addMetadata('ticket', {abtCustomerId});
            });
            dispatch({type: 'SET_ERROR_REFRESHING_FARE_CONTRACT_TICKETS'});
          },
        );

      // Stop listening for updates when no longer required
      return () => subscriber();
    }
  }, [user, abtCustomerId, enable_ticketing]);

  const refreshTickets = () => {};

  const addReservation = useCallback(
    (reservation: ActiveReservation) => {
      Bugsnag.leaveBreadcrumb('add_reservation', {
        order_id: reservation.reservation.order_id,
      });
      dispatch({
        type: 'ADD_RESERVATION',
        reservation,
      });
    },
    [dispatch],
  );

  const getPaymentStatus = useCallback(async function (
    paymentId: number,
  ): Promise<PaymentStatus | undefined> {
    try {
      const payment = await getPayment(paymentId);
      return payment.status;
    } catch (err) {
      console.warn(err);
    }
  },
  []);

  const pollPaymentStatus = useCallback(
    async function () {
      const updatedReservations = await Promise.all(
        activeReservations.map(async (res) => {
          const paymentStatus = await getPaymentStatus(
            res.reservation.payment_id,
          );
          return {
            ...res,
            paymentStatus,
          };
        }),
      );

      dispatch({
        type: 'UPDATE_RESERVATIONS',
        activeReservations: updatedReservations.filter(
          (res) => !isHandledPaymentStatus(res.paymentStatus),
        ),
      });
    },
    [activeReservations, getPaymentStatus],
  );

  useInterval(
    pollPaymentStatus,
    500,
    [activeReservations],
    !activeReservations.length ||
      activeReservations.every((res) => res.paymentStatus === 'CAPTURE'),
  );

  return (
    <TicketContext.Provider
      value={{
        ...state,
        activeReservations,
        refreshTickets,
        addReservation,
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
