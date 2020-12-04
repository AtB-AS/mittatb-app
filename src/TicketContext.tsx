import React, {
  useContext,
  createContext,
  useCallback,
  useReducer,
  useEffect,
} from 'react';
import {
  FareContractTicket,
  getPayment,
  PaymentStatus,
  PaymentType,
  ReserveOffer,
  TicketReservation,
} from './api/fareContracts';
import {listFareContractTickets} from './api';
import useInterval from './utils/use-interval';

type TicketReducerState = {
  fareContractTickets: FareContractTicket[];
  activeReservations: ActiveReservation[];
  isRefreshingTickets: boolean;
};

type TicketReducerAction =
  | {type: 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS'}
  | {
      type: 'UPDATE_FARE_CONTRACT_TICKETS';
      fareContractTickets: FareContractTicket[];
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
      const orderIds = action.fareContractTickets.map((fc) => fc.order_id);
      return {
        ...prevState,
        activeReservations: prevState.activeReservations.filter(
          (res) => !orderIds.includes(res.reservation.order_id),
        ),
        fareContractTickets: action.fareContractTickets,
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
  refreshTickets: () => void;
  activatePollingForNewTickets: (reservation: ActiveReservation) => void;
} & Pick<
  TicketReducerState,
  'activeReservations' | 'fareContractTickets' | 'isRefreshingTickets'
>;

const initialReducerState: TicketReducerState = {
  fareContractTickets: [],
  activeReservations: [],
  isRefreshingTickets: false,
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

  const updateFareContractTickets = useCallback(
    async function () {
      try {
        dispatch({type: 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS'});
        const {
          fare_contracts: fareContractTickets,
        } = await listFareContractTickets();
        dispatch({type: 'UPDATE_FARE_CONTRACT_TICKETS', fareContractTickets});
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
    updateFareContractTickets,
    1000,
    [],
    !activeReservations.some((res) => res.paymentStatus === 'CAPTURE'),
  );

  useEffect(() => {
    updateFareContractTickets();
  }, []);

  return (
    <TicketContext.Provider
      value={{
        ...state,
        activeReservations,
        refreshTickets: updateFareContractTickets,
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
