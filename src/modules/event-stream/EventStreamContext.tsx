import {createContext, useContext, useEffect, useId, useRef} from 'react';
import {useSetupEventStream} from './use-setup-event-stream';
import {EventKind, StreamEventLog, StreamEventOfKind} from './types';

interface EventStreamContextValue {
  eventLog: StreamEventLog;
  /**
   * Listens for events of a specific kind from the event stream, and calls the
   * provided callback when events of that kind are received.
   */
  useStreamEventListener: <K extends EventKind>(
    eventKind: K,
    callback: (streamEvent: StreamEventOfKind<K>) => void,
  ) => void;
  /**
   * Calls the provided callback when the event stream reconnects after being
   * disconnected. Events may have been missed while disconnected, so this can
   * be used to refetch data that would otherwise be updated by events.
   */
  useStreamReconnectListener: (callback: () => void) => void;
}

export const EventStreamContext = createContext<EventStreamContextValue>({
  eventLog: [],
  useStreamEventListener: () => {},
  useStreamReconnectListener: () => {},
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
  const {
    eventLog,
    subscribe,
    unsubscribe,
    subscribeToReconnect,
    unsubscribeFromReconnect,
  } = useSetupEventStream();

  function useStreamEventListener<K extends EventKind>(
    eventKind: K,
    callback: (streamEvent: StreamEventOfKind<K>) => void,
  ) {
    const id = useId();

    // Keep the callback in a ref to avoid resubscribes on rerenders.
    const callbackRef = useRef(callback);
    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
      // The event kind isn't unique when several listeners listen to the same
      // event kind, so we combine it with an ID that is unique to this hook
      // instance.
      const listenerId = `${eventKind}-${id}`;

      subscribe({
        id: listenerId,
        eventKind,
        callback: (streamEvent) => callbackRef.current(streamEvent),
      });
      return () => {
        unsubscribe(listenerId);
      };
    }, [eventKind, id]);
  }

  function useStreamReconnectListener(callback: () => void) {
    const id = useId();

    // Keep the callback in a ref to avoid resubscribes on rerenders.
    const callbackRef = useRef(callback);
    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
      const listenerId = `reconnect-${id}`;
      subscribeToReconnect({
        id: listenerId,
        callback: () => callbackRef.current(),
      });
      return () => {
        unsubscribeFromReconnect(listenerId);
      };
    }, [id]);
  }

  return (
    <EventStreamContext.Provider
      value={{
        eventLog,
        useStreamEventListener,
        useStreamReconnectListener,
      }}
    >
      {children}
    </EventStreamContext.Provider>
  );
};
