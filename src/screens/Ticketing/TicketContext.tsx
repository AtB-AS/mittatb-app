import React, {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {FareContract} from '../../api/fareContracts';
import usePollableResource from '../../utils/use-pollable-resource';
import {listFareContracts} from '../../api';

type TicketState = {
  fareContracts: FareContract[] | undefined;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  activatePollingForNewTickets: () => void;
};

const TicketContext = createContext<TicketState | undefined>(undefined);

const TicketContextProvider: React.FC = ({children}) => {
  const [poll, setPoll] = useState(false);

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
    disabled: !poll,
  });

  useEffect(() => setPoll(false), [fareContracts?.length]);

  return (
    <TicketContext.Provider
      value={{
        fareContracts,
        refreshTickets,
        isRefreshingTickets,
        activatePollingForNewTickets: () => setPoll(true),
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
