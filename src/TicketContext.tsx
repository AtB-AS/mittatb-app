import React, {useContext, createContext, useCallback, useState} from 'react';
import {
  FareContract,
  PaymentType,
  ReserveOffer,
  TicketReservation,
} from './api/fareContracts';
import usePollableResource from './utils/use-pollable-resource';
import {listFareContracts} from './api';

type TicketState = {
  fareContracts: FareContract[] | undefined;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  activatePollingForNewTickets: (
    reservation: TicketReservation,
    offers: ReserveOffer[],
    paymentType: PaymentType,
  ) => void;
};

type ActiveReservation = {
  reservation: TicketReservation;
  offers: ReserveOffer[];
  paymentType: PaymentType;
};

const TicketContext = createContext<TicketState | undefined>(undefined);

const TicketContextProvider: React.FC = ({children}) => {
  const [reservations, setReservations] = useState<ActiveReservation[]>([]);

  const updateReservations = (
    reservation: TicketReservation,
    offers: ReserveOffer[],
    paymentType: PaymentType,
  ) => setReservations([...reservations, {reservation, offers, paymentType}]);

  const getFareContracts = useCallback(async function () {
    try {
      const {fare_contracts} = await listFareContracts();
      return fare_contracts;
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const [
    fareContracts,
    refreshTickets,
    isRefreshingTickets,
  ] = usePollableResource(getFareContracts, {
    initialValue: [],
    pollingTimeInSeconds: 1,
    disabled: !reservations.length,
  });

  return (
    <TicketContext.Provider
      value={{
        fareContracts,
        refreshTickets,
        isRefreshingTickets,
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
