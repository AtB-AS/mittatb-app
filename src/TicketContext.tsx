import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {
  FareContract,
  getPayment,
  PaymentStatus,
  PaymentType,
  ReserveOffer,
  TicketReservation,
} from './api/fareContracts';
import useInterval from './utils/use-interval';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useAuthState} from './auth';

type TicketReducerState = {
  fareContracts: FareContract[];
  activeReservations: ActiveReservation[];
  isRefreshingTickets: boolean;
  errorRefreshingTickets: boolean;
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

export type ActiveReservation = {
  reservation: TicketReservation;
  offers: ReserveOffer[];
  paymentType: PaymentType;
  paymentStatus?: PaymentStatus;
};

type TicketState = {
  addReservation: (reservation: ActiveReservation) => void;
  refreshTickets: () => void;
  activeFareContracts: FareContract[];
  expiredFareContracts: FareContract[];
  findFareContractByOrderId: (id: string) => FareContract | undefined;
} & Pick<TicketReducerState, 'activeReservations' | 'isRefreshingTickets'>;

const initialReducerState: TicketReducerState = {
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

  useEffect(() => {
    if (user && abtCustomerId) {
      const subscriber = firestore()
        .collection('customers')
        .doc(abtCustomerId)
        .collection('fareContracts')
        .onSnapshot(
          (snapshot) => {
            const fareContracts = snapshot.docs.map<FareContract>((d) =>
              d.data(),
            );
            dispatch({type: 'UPDATE_FARE_CONTRACT_TICKETS', fareContracts});
          },
          (err) => {
            console.warn(err),
              dispatch({type: 'SET_ERROR_REFRESHING_FARE_CONTRACT_TICKETS'});
          },
        );

      // Stop listening for updates when no longer required
      return () => subscriber();
    }
  }, [user, abtCustomerId]);

  const refreshTickets = () => {};

  const addReservation = useCallback(
    (reservation: ActiveReservation) =>
      dispatch({
        type: 'ADD_RESERVATION',
        reservation,
      }),
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

  // const updateFareContracts = useCallback(
  //   async function () {
  //     try {
  //       dispatch({type: 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS'});
  //       const fareContracts = await listFareContracts();
  //       dispatch({type: 'UPDATE_FARE_CONTRACT_TICKETS', fareContracts});
  //     } catch (err) {
  //       console.warn(err);
  //       dispatch({type: 'SET_ERROR_REFRESHING_FARE_CONTRACT_TICKETS'});
  //     }
  //   },
  //   [dispatch],
  // );

  useInterval(
    pollPaymentStatus,
    500,
    [activeReservations],
    !activeReservations.length ||
      activeReservations.every((res) => res.paymentStatus === 'CAPTURE'),
  );

  // useInterval(
  //   updateFareContracts,
  //   1000,
  //   [],
  //   !state.errorRefreshingTickets &&
  //     !activeReservations.some((res) => res.paymentStatus === 'CAPTURE'),
  // );

  // useEffect(() => {
  //   updateFareContracts();
  // }, []);

  return (
    <TicketContext.Provider
      value={{
        ...state,
        activeReservations,
        refreshTickets,
        addReservation,
        // activatePollingForNewTickets: updateReservations,
        // activeFareContracts: getActive(state.fareContracts),
        // expiredFareContracts: getExpired(state.fareContracts),
        activeFareContracts: [],
        expiredFareContracts: [],
        findFareContractByOrderId: (orderId) =>
          state.fareContracts.find((fc) => fc.orderId === orderId),
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

// const byExpiryComparator = (a: FareContract, b: FareContract): number => {
//   return b.usage_valid_to - a.usage_valid_to;
// };

// function getActive(fareContracts: FareContract[]) {
//   const isValidNow = (f: FareContract): boolean =>
//     f.usage_valid_to > Date.now() / 1000;
//   const isActivated = (f: FareContract) =>
//     f.state === FareContractLifecycleState.Activated;
//   return fareContracts
//     .filter(isValidNow)
//     .filter(isActivated)
//     .sort(byExpiryComparator);
// }

// function getExpired(fareContracts: FareContract[]) {
//   const isExpired = (f: FareContract): boolean =>
//     !(f.usage_valid_to > Date.now() / 1000);
//   const isRefunded = (f: FareContract) =>
//     f.state === FareContractLifecycleState.Refunded;
//   const isExpiredOrRefunded = (f: FareContract) =>
//     isExpired(f) || isRefunded(f);
//   return fareContracts.filter(isExpiredOrRefunded).sort(byExpiryComparator);
// }

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
