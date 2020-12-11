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
  PreassignedFareProduct,
  ReserveOffer,
  TicketReservation,
} from './api/fareContracts';
import {
  listFareContracts,
  listPreassignedFareProducts,
  listUserProfiles,
  listTariffZones,
} from './api';
import useInterval from './utils/use-interval';
import {UserProfile} from './api/userProfiles';
import {TariffZone} from './api/tariffZones';

type TicketReducerState = {
  fareContracts: FareContract[];
  preassignedFareProducts: PreassignedFareProduct[];
  preassignedFareProductsLoading: boolean;
  userProfiles: UserProfile[];
  userProfilesLoading: boolean;
  tariffZones: TariffZone[];
  tariffZonesLoading: boolean;
  activeReservations: ActiveReservation[];
  isRefreshingTickets: boolean;
};

type TicketReducerAction =
  | {type: 'SET_IS_REFRESHING_FARE_CONTRACT_TICKETS'}
  | {
      type: 'UPDATE_FARE_CONTRACT_TICKETS';
      fareContracts: FareContract[];
    }
  | {
      type: 'LOADED_PREASSIGNED_FARE_PRODUCTS';
      preassignedFareProducts: PreassignedFareProduct[];
    }
  | {
      type: 'LOADED_USER_PROFILES';
      userProfiles: UserProfile[];
    }
  | {
      type: 'LOADED_TARIFF_ZONES';
      tariffZones: TariffZone[];
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
    case 'LOADED_PREASSIGNED_FARE_PRODUCTS': {
      return {
        ...prevState,
        preassignedFareProducts: action.preassignedFareProducts,
        preassignedFareProductsLoading: false,
      };
    }
    case 'LOADED_USER_PROFILES': {
      return {
        ...prevState,
        userProfiles: action.userProfiles,
        userProfilesLoading: false,
      };
    }
    case 'LOADED_TARIFF_ZONES': {
      return {
        ...prevState,
        tariffZones: action.tariffZones,
        tariffZonesLoading: false,
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
  isLoadingNecessaryTicketData: boolean;
} & Pick<
  TicketReducerState,
  | 'activeReservations'
  | 'fareContracts'
  | 'preassignedFareProducts'
  | 'userProfiles'
  | 'isRefreshingTickets'
  | 'tariffZones'
>;

const initialReducerState: TicketReducerState = {
  fareContracts: [],
  preassignedFareProducts: [],
  preassignedFareProductsLoading: true,
  userProfiles: [],
  userProfilesLoading: true,
  tariffZones: [],
  tariffZonesLoading: true,
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

  const loadPreassignedFareProducts = useCallback(
    async function () {
      try {
        const preassignedFareProducts = await listPreassignedFareProducts();
        dispatch({
          type: 'LOADED_PREASSIGNED_FARE_PRODUCTS',
          preassignedFareProducts,
        });
      } catch (err) {
        console.warn(err);
      }
    },
    [dispatch],
  );

  const loadUserProfiles = useCallback(
    async function () {
      try {
        const userProfiles = await listUserProfiles();
        dispatch({
          type: 'LOADED_USER_PROFILES',
          userProfiles,
        });
      } catch (err) {
        console.warn(err);
      }
    },
    [dispatch],
  );

  const loadTariffZones = useCallback(
    async function () {
      try {
        const tariffZones = await listTariffZones();
        dispatch({
          type: 'LOADED_TARIFF_ZONES',
          tariffZones,
        });
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
    loadPreassignedFareProducts();
  }, []);

  useEffect(() => {
    loadUserProfiles();
  }, []);

  useEffect(() => {
    loadTariffZones();
  }, []);

  return (
    <TicketContext.Provider
      value={{
        ...state,
        activeReservations,
        refreshTickets: updateFareContracts,
        activatePollingForNewTickets: updateReservations,
        isLoadingNecessaryTicketData:
          state.preassignedFareProductsLoading ||
          state.userProfilesLoading ||
          state.tariffZonesLoading,
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
