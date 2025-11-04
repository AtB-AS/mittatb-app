import {useSubscription} from '@atb/api/use-subscription';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useState} from 'react';
import {WS_API_BASE_URL} from '@env';
import {getIdTokenGlobal, useAuthContext} from '../auth';
import Bugsnag from '@bugsnag/react-native';
import {handleStreamEvent} from './handle-stream-event';
import {StreamEventLog, StreamEvent, StreamEventSchema} from './types';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {jsonStringToObject} from '@atb/utils/object';

export const useSetupEventStream = () => {
  const queryClient = useQueryClient();
  const {userId, isValidIdToken} = useAuthContext();
  const {isEventStreamEnabled, isEventStreamFareContractsEnabled} =
    useFeatureTogglesContext();

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
      handleStreamEvent(streamEvent, queryClient, userId, {
        isEventStreamFareContractsEnabled,
      });
    },
    [queryClient, isEventStreamFareContractsEnabled, userId, addToEventLog],
  );

  const onOpen = useCallback(
    (ws: WebSocket) => {
      addToEventLog({meta: 'OPEN'});
      ws.send(`AUTH ${getIdTokenGlobal()}`);
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
    // When id token is valid, we connect to the stream
    enabled: isEventStreamEnabled && isValidIdToken,
    onMessage,
    onOpen,
    onClose,
  });

  return {eventLog};
};
