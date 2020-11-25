import React, {
  useContext,
  createContext,
  useCallback,
  useState,
  useReducer,
  useEffect,
} from 'react';
import {
  FareContract,
  getPayment,
  PaymentStatus,
  PaymentType,
  ReserveOffer,
  TicketReservation,
} from './api/fareContracts';
import {listFareContracts} from './api';
import useInterval from './utils/use-interval';
import {updateObjectInArray} from './utils/array';

type TicketReducerState = {
  fareContracts: FareContract[];
  activeReservations: ActiveReservation[];
  isRefreshingTickets: boolean;
};

type TicketReducerAction =
  | {type: 'SET_IS_REFRESHING_FARE_CONTRACTS'}
  | {type: 'UPDATE_FARE_CONTRACTS'; fareContracts: FareContract[]}
  | {type: 'ADD_RESERVATION'; reservation: ActiveReservation}
  | {
      type: 'UPDATE_PAYMENT_STATUS';
      orderId: string;
      paymentStatus: ActivePaymentStatus;
    };

type TicketReducer = (
  prevState: TicketReducerState,
  action: TicketReducerAction,
) => TicketReducerState;

const ticketReducer: TicketReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_IS_REFRESHING_FARE_CONTRACTS': {
      return {
        ...prevState,
        isRefreshingTickets: true,
      };
    }
    case 'UPDATE_FARE_CONTRACTS': {
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
    case 'ADD_RESERVATION': {
      return {
        ...prevState,
        activeReservations: [
          ...prevState.activeReservations,
          action.reservation,
        ],
      };
    }
    case 'UPDATE_PAYMENT_STATUS': {
      const index = prevState.activeReservations.findIndex(
        (res) => res.reservation.order_id === action.orderId,
      );
      if (index === -1) return prevState;

      const activeReservations = updateObjectInArray(
        prevState.activeReservations,
        {paymentStatus: action.paymentStatus},
        index,
      );

      return {
        ...prevState,
        activeReservations,
      };
    }
  }
};

type ActivePaymentStatus = PaymentStatus | 'UNKNOWN';

export type ActiveReservation = {
  reservation: TicketReservation;
  offers: ReserveOffer[];
  paymentType: PaymentType;
  paymentStatus: ActivePaymentStatus;
};

type TicketState = {
  refreshTickets: () => void;
  activatePollingForNewTickets: (
    reservation: TicketReservation,
    offers: ReserveOffer[],
    paymentType: PaymentType,
  ) => void;
} & Pick<
  TicketReducerState,
  'activeReservations' | 'fareContracts' | 'isRefreshingTickets'
>;

const initialReducerState: TicketReducerState = {
  fareContracts: [],
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
    (
      reservation: TicketReservation,
      offers: ReserveOffer[],
      paymentType: PaymentType,
      paymentStatus: ActivePaymentStatus = 'UNKNOWN',
    ) =>
      dispatch({
        type: 'ADD_RESERVATION',
        reservation: {reservation, offers, paymentType, paymentStatus},
      }),
    [dispatch],
  );

  const getPaymentStatus = useCallback(async function (
    paymentId: number,
  ): Promise<ActivePaymentStatus> {
    try {
      const payment = await getPayment(paymentId);
      return payment.status;
    } catch (err) {
      console.warn(err);
      return 'UNKNOWN';
    }
  },
  []);

  const pollPaymentStatus = useCallback(
    async function () {
      activeReservations.forEach(async (res) => {
        const paymentStatus = await getPaymentStatus(
          res.reservation.payment_id,
        );
        dispatch({
          type: 'UPDATE_PAYMENT_STATUS',
          orderId: res.reservation.order_id,
          paymentStatus,
        });
      });
    },
    [activeReservations, getPaymentStatus],
  );

  const updateFareContracts = useCallback(
    async function () {
      try {
        dispatch({type: 'SET_IS_REFRESHING_FARE_CONTRACTS'});
        const {fare_contracts: fareContracts} = await listFareContracts();
        dispatch({type: 'UPDATE_FARE_CONTRACTS', fareContracts});
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
    !activeReservations.some(
      (res) =>
        res.paymentStatus !== 'CANCEL' && res.paymentStatus !== 'CAPTURE',
    ),
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
