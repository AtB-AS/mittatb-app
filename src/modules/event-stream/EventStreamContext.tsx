import {createContext, useContext} from 'react';
import {
  StreamEventListener,
  useSetupEventStream,
} from './use-setup-event-stream';
import {EventKind, StreamEventLog} from './types';

interface EventStreamContextValue {
  eventLog: StreamEventLog;
  /**
   * NOTE: Usually should not be called directly, but rather through the
   * `useEventStreamListener` hook.
   */
  subscribe: <K extends EventKind>(listener: StreamEventListener<K>) => void;
  /**
   * NOTE: Usually should not be called directly, but rather through the
   * `useEventStreamListener` hook.
   */
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
