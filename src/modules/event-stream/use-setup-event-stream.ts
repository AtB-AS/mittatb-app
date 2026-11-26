import {useSubscription} from '@atb/api/use-subscription';
import {useCallback, useRef, useState} from 'react';
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

export type ReconnectListener = {
  id: string;
  callback: () => void;
};

export const useSetupEventStream = () => {
  const {authStatus} = useAuthContext();
  const {isEventStreamEnabled} = useFeatureTogglesContext();
  // Listeners are kept in refs, since changing `onMessage` or `onOpen` would
  // recreate the websocket.
  const listeners = useRef<StreamEventListener[]>([]);
  const reconnectListeners = useRef<ReconnectListener[]>([]);
  // Set when the connection is closed unexpectedly, so the next open can be
  // treated as a reconnect. Not set when the websocket is recreated by
  // `useSubscription` itself, since `onClose` isn't called in that case.
  const hasBeenDisconnected = useRef(false);

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
      listeners.current
        .filter((listener) => listener.eventKind === streamEvent.event)
        .forEach((listener) => listener.callback(streamEvent));
    },
    [addToEventLog],
  );

  const onOpen = useCallback(
    (ws: WebSocket) => {
      addToEventLog({meta: 'OPEN'});
      authWhenReady(ws, addToEventLog, () => {
        // Cleared here rather than on open, so a reconnect isn't lost if the
        // websocket is replaced while waiting for a token.
        if (!hasBeenDisconnected.current) return;
        hasBeenDisconnected.current = false;
        addToEventLog({meta: 'RECONNECTED'});
        reconnectListeners.current.forEach((listener) => listener.callback());
      });
    },
    [addToEventLog],
  );

  const onClose = useCallback(
    (event: WebSocketCloseEvent) => {
      addToEventLog({meta: `CLOSE: ${event.code} ${event.message}`});
      hasBeenDisconnected.current = true;
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
      listeners.current = [
        ...listeners.current,
        listener,
      ] as StreamEventListener[];
    },
    [addToEventLog],
  );
  const unsubscribe = useCallback(
    (id: string) => {
      addToEventLog({meta: `UNSUBSCRIBE: ${id}`});
      listeners.current = listeners.current.filter(
        (listener) => listener.id !== id,
      );
    },
    [addToEventLog],
  );

  const subscribeToReconnect = useCallback(
    (listener: ReconnectListener) => {
      addToEventLog({meta: `SUBSCRIBE RECONNECT: ${listener.id}`});
      reconnectListeners.current = [...reconnectListeners.current, listener];
    },
    [addToEventLog],
  );
  const unsubscribeFromReconnect = useCallback(
    (id: string) => {
      addToEventLog({meta: `UNSUBSCRIBE RECONNECT: ${id}`});
      reconnectListeners.current = reconnectListeners.current.filter(
        (listener) => listener.id !== id,
      );
    },
    [addToEventLog],
  );

  return {
    eventLog,
    subscribe,
    unsubscribe,
    subscribeToReconnect,
    unsubscribeFromReconnect,
  };
};

/**
 * Before sending the AUTH message, ensure we have a valid ID token. If not,
 * wait and try again in 1 second.
 */
function authWhenReady(
  ws: WebSocket,
  addToEventLog: ({meta}: {meta?: string | undefined}) => void,
  onAuth: () => void,
) {
  if (ws.readyState !== WebSocket.OPEN) return;
  const token = getIdTokenGlobal();
  if (token) {
    addToEventLog({meta: 'AUTH'});
    ws.send(`AUTH ${token}`);
    onAuth();
  } else {
    setTimeout(() => authWhenReady(ws, addToEventLog, onAuth), 1000);
  }
}
