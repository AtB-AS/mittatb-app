import {useEffect, useId, useRef} from 'react';
import {useEventStreamContext} from './EventStreamContext';
import {EventKind, StreamEventOfKind} from './types';

/**
 * Listens for events of a specific kind from the event stream, and calls the
 * provided callback when events of that kind are received.
 */
export function useEventStreamListener<K extends EventKind>(
  eventKind: K,
  callback: (streamEvent: StreamEventOfKind<K>) => void,
) {
  const {subscribe, unsubscribe} = useEventStreamContext();
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
  }, [subscribe, unsubscribe, eventKind, id]);
}
