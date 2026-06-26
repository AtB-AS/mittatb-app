import {createContext, useContext, useEffect} from 'react';
import {
  StreamEventListener,
  useSetupEventStream,
} from './use-setup-event-stream';
import {EventKind, StreamEventLog} from './types';
import {useQueryClient} from '@tanstack/react-query';
import {getBonusBalanceQueryKey} from '../bonus/queries/use-bonus-balance-query';
import {getBonusAmountEarnedQueryKey} from '../bonus';
import {useAuthContext} from '../auth';
import {getShmoBookingQueryKey} from '../mobility/queries/use-shmo-booking-query';
import {languageGlobal} from '../locale';
import {getActiveShmoBookingQueryKey} from '../mobility/queries/use-active-shmo-booking-query';
import {invalidateFareContractsQuery} from '../ticketing/use-fare-contracts';
import {useFeatureTogglesContext} from '../feature-toggles';

interface EventStreamContextValue {
  eventLog: StreamEventLog;
  subscribe: <K extends EventKind>(listener: StreamEventListener<K>) => void;
  unsubscribe: (id: string) => void;
}

export const EventStreamContext = createContext<EventStreamContextValue>({
  eventLog: [],
  subscribe: () => {},
  unsubscribe: () => {},
});

export function useEventStreamContext() {
  const context = useContext(EventStreamContext);
  if (context === undefined) {
    throw new Error(
      'useEventStreamContext must be used within a EventStreamContextProvider',
    );
  }
  return context;
}

type Props = {
  children: React.ReactNode;
};

export const EventStreamContextProvider = ({children}: Props) => {
  const {eventLog, subscribe, unsubscribe} = useSetupEventStream();
  const queryClient = useQueryClient();
  const {userId} = useAuthContext();
  const {isEventStreamFareContractsEnabled} = useFeatureTogglesContext();

  useEffect(() => {
    const fareContractListenerId = 'fare-contract-listener';
    subscribe({
      id: fareContractListenerId,
      eventKind: EventKind.FareContract,
      callback: () => {
        if (isEventStreamFareContractsEnabled) {
          invalidateFareContractsQuery(queryClient);
        }
      },
    });
    return () => {
      unsubscribe(fareContractListenerId);
    };
  }, [subscribe, unsubscribe, queryClient, isEventStreamFareContractsEnabled]);

  useEffect(() => {
    const shmoBookingListenerId = 'shmo-booking-updated-listener';
    subscribe({
      id: shmoBookingListenerId,
      eventKind: EventKind.ShmoBookingUpdated,
      callback: (streamEvent) => {
        queryClient.invalidateQueries({
          queryKey: getActiveShmoBookingQueryKey(languageGlobal),
        });
        queryClient.invalidateQueries({
          queryKey: getShmoBookingQueryKey(
            streamEvent.bookingId,
            languageGlobal,
          ),
        });
      },
    });
    return () => {
      unsubscribe(shmoBookingListenerId);
    };
  }, [
    subscribe,
    unsubscribe,
    queryClient,
    userId,
    isEventStreamFareContractsEnabled,
  ]);

  useEffect(() => {
    const personalisationProgramPointListenerId =
      'personalisation-program-point-listener';
    subscribe({
      id: personalisationProgramPointListenerId,
      eventKind: EventKind.PersonalisationProgramPoint,
      callback: (streamEvent) => {
        queryClient.invalidateQueries({
          queryKey: getBonusBalanceQueryKey(userId),
        });
        queryClient.invalidateQueries({
          queryKey: getBonusAmountEarnedQueryKey(userId, streamEvent.orderId),
        });
      },
    });
    return () => {
      unsubscribe(personalisationProgramPointListenerId);
    };
  }, [subscribe, unsubscribe, queryClient, userId]);

  return (
    <EventStreamContext.Provider
      value={{
        eventLog,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </EventStreamContext.Provider>
  );
};
