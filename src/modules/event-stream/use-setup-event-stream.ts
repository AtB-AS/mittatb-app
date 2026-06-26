import {useSubscription} from '@atb/api/use-subscription';
import {useCallback, useState} from 'react';
import {WS_API_BASE_URL} from '@env';
import {
  getIdTokenGlobal,
  isIdTokenRefreshEnabled,
  useAuthContext,
} from '../auth';
import Bugsnag from '@bugsnag/react-native';
import {
  StreamEventLog,
  StreamEvent,
  StreamEventOfKind,
  StreamEventSchema,
  EventKind,
} from './types';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {jsonStringToObject} from '@atb/utils/object';

export type StreamEventListener<K extends EventKind = EventKind> = {
  id: string;
  eventKind: K;
  callback: (streamEvent: StreamEventOfKind<K>) => void;
};

export const useSetupEventStream = () => {
  const {authStatus} = useAuthContext();
  const {isEventStreamEnabled} = useFeatureTogglesContext();
  const [listeners, setListeners] = useState<StreamEventListener[]>([]);

  // Keep a list of events to use for debugging. In memory only, so this will be
  // reset when reloading the app.
  const [eventLog, setEventLog] = useState<StreamEventLog>([]);
  const addToEventLog = useCallback(
    ({streamEvent, meta}: {streamEvent?: StreamEvent; meta?: string}) => {
      setEventLog((prev) => [{date: new Date(), streamEvent, meta}, ...prev]);
    },
    [],
  );

  const url = `${WS_API_BASE_URL}stream/v1`;

  // Id token needs to be fresh for authentication (`AUTH ${token}`).
  const enabled = isEventStreamEnabled && isIdTokenRefreshEnabled(authStatus);

  const onMessage = useCallback(
    (event: WebSocketMessageEvent) => {
      const message = StreamEventSchema.safeParse(
        jsonStringToObject(event.data),
      );
      if (!message.success) {
        Bugsnag.leaveBreadcrumb('Received unknown message from stream', {
          data: event.data,
        });
        return;
      }
      const streamEvent = message.data;
      Bugsnag.leaveBreadcrumb('Received event from stream', {
        data: event.data,
      });

      addToEventLog({streamEvent});
      listeners
        .filter((listener) => listener.eventKind === streamEvent.event)
        .forEach((listener) => listener.callback(streamEvent));
    },
    [addToEventLog, listeners],
  );

  const onOpen = useCallback(
    (ws: WebSocket) => {
      addToEventLog({meta: 'OPEN'});
      authWhenReady(ws, addToEventLog);
    },
    [addToEventLog],
  );

  const onClose = useCallback(
    (event: WebSocketCloseEvent) => {
      addToEventLog({meta: `CLOSE: ${event.code} ${event.message}`});
    },
    [addToEventLog],
  );

  useSubscription({
    url,
    enabled,
    onMessage,
    onOpen,
    onClose,
  });

  const subscribe = useCallback(
    <K extends EventKind>(listener: StreamEventListener<K>) => {
      addToEventLog({
        meta: `SUBSCRIBE: ${listener.id}`,
      });
      setListeners((prev) => [...prev, listener] as StreamEventListener[]);
    },
    [addToEventLog],
  );
  const unsubscribe = useCallback(
    (id: string) => {
      addToEventLog({meta: `UNSUBSCRIBE: ${id}`});
      setListeners((prev) => prev.filter((listener) => listener.id !== id));
    },
    [addToEventLog],
  );

  return {eventLog, subscribe, unsubscribe};
};

/**
 * Before sending the AUTH message, ensure we have a valid ID token. If not,
 * wait and try again in 1 second.
 */
function authWhenReady(
  ws: WebSocket,
  addToEventLog: ({meta}: {meta?: string | undefined}) => void,
) {
  if (ws.readyState !== WebSocket.OPEN) return;
  const token = getIdTokenGlobal();
  if (token) {
    addToEventLog({meta: 'AUTH'});
    ws.send(`AUTH ${token}`);
  } else {
    setTimeout(() => authWhenReady(ws, addToEventLog), 1000);
  }
}
