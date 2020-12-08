import React, {
  useContext,
  createContext,
  useCallback,
  useReducer,
  useEffect,
} from 'react';
import {
  FareContract,
  FareContractType,
  getPayment,
  PaymentStatus,
  PaymentType,
  ReserveOffer,
  TicketReservation,
} from './api/fareContracts';
import {listFareContracts, listFareContractTypes} from './api';
import useInterval from './utils/use-interval';

type TicketReducerState = {
  fareContracts: FareContract[];
  fareContractTypes: FareContractType[];
  activeReservations: ActiveReservation[];
  isRefreshingTickets: boolean;
  isRefreshingTypes: boolean;
};

type TicketReducerAction =
  | {type: 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS'}
  | {
      type: 'UPDATE_FARE_CONTRACT_TICKETS';
      fareContracts: FareContract[];
    }
  | {type: 'SET_IS_REFRESHING_FARE_CONTRACT_TYPES'}
  | {
      type: 'UPDATE_FARE_CONTRACT_TYPES';
      fareContractTypes: FareContractType[];
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
      };
    }
    case 'UPDATE_FARE_CONTRACT_TICKETS': {
      const orderIds = action.fareContracts.map((fc) => fc.order_id);
      return {
        ...prevState,
        activeReservations: prevState.activeReservations.filter(
          (res) => !orderIds.includes(res.reservation.order_id),
        ),
        fareContracts: action.fareContracts,
        isRefreshingTickets: false,
      };
    }
    case 'SET_IS_REFRESHING_FARE_CONTRACT_TYPES': {
      return {
        ...prevState,
        isRefreshingTypes: true,
      };
    }
    case 'UPDATE_FARE_CONTRACT_TYPES': {
      return {
        ...prevState,
        fareContractTypes: action.fareContractTypes,
        isRefreshingTypes: false,
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
  refreshTickets: () => void;
  activatePollingForNewTickets: (reservation: ActiveReservation) => void;
} & Pick<
  TicketReducerState,
  | 'activeReservations'
  | 'fareContracts'
  | 'fareContractTypes'
  | 'isRefreshingTickets'
  | 'isRefreshingTypes'
>;

const initialReducerState: TicketReducerState = {
  fareContracts: [],
  fareContractTypes: [],
  activeReservations: [],
  isRefreshingTickets: false,
  isRefreshingTypes: false,
};

const TicketContext = createContext<TicketState | undefined>(undefined);

const TicketContextProvider: React.FC = ({children}) => {
  const [{activeReservations, ...state}, dispatch] = useReducer(
    ticketReducer,
    initialReducerState,
  );

  const updateReservations = useCallback(
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

  const updateFareContracts = useCallback(
    async function () {
      try {
        dispatch({type: 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS'});
        const fareContracts = await listFareContracts();
        dispatch({type: 'UPDATE_FARE_CONTRACT_TICKETS', fareContracts});
      } catch (err) {
        console.warn(err);
      }
    },
    [dispatch],
  );

  const updateFareContractTypes = useCallback(
    async function () {
      try {
        dispatch({type: 'SET_IS_REFRESHING_FARE_CONTRACT_TYPES'});
        const fareContractTypes = await listFareContractTypes();
        dispatch({type: 'UPDATE_FARE_CONTRACT_TYPES', fareContractTypes});
      } catch (err) {
        console.warn(err);
      }
    },
    [dispatch],
  );

  useInterval(
    pollPaymentStatus,
    500,
    [activeReservations],
    !activeReservations.length ||
      activeReservations.every((res) => res.paymentStatus === 'CAPTURE'),
  );

  useInterval(
    updateFareContracts,
    1000,
    [],
    !activeReservations.some((res) => res.paymentStatus === 'CAPTURE'),
  );

  useEffect(() => {
    updateFareContracts();
  }, []);

  useEffect(() => {
    updateFareContractTypes();
  }, []);

  return (
    <TicketContext.Provider
      value={{
        ...state,
        activeReservations,
        refreshTickets: updateFareContracts,
        activatePollingForNewTickets: updateReservations,
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
