import {useEffect, useId} from 'react';
import {useEventStreamContext} from './EventStreamContext';
import {EventKind, StreamEventOfKind} from './types';

/**
 * Listens for events of a specific kind from the event stream, and calls the
 * provided callback when such events are received.
 */
export function useEventStreamListener<K extends EventKind>(
  eventKind: K,
  callback: (streamEvent: StreamEventOfKind<K>) => void,
) {
  const {subscribe, unsubscribe} = useEventStreamContext();
  const id = useId();

  useEffect(() => {
    const listenerId = `${eventKind}-${id}`;
    subscribe({
      id: listenerId,
      eventKind,
      callback,
    });
    return () => {
      unsubscribe(listenerId);
    };
  }, [subscribe, unsubscribe, callback, eventKind, id]);
}
