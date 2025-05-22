import {useSubscription} from '@atb/api/use-subscription';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback} from 'react';
import {WS_API_BASE_URL} from '@env';
import {getIdTokenGlobal, useAuthContext} from '../auth';
import Bugsnag from '@bugsnag/react-native';
import {handleStreamEvent} from './handle-stream-event';
import {StreamEvent} from './types';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {jsonStringToObject} from '@atb/utils/object';

export const useSetupEventStream = () => {
  const queryClient = useQueryClient();
  const {abtCustomerId} = useAuthContext();
  const {isEventStreamEnabled} = useFeatureTogglesContext();

  const url = `${WS_API_BASE_URL}stream/v1`;

  const onMessage = useCallback(
    (event: WebSocketMessageEvent) => {
      const message = StreamEvent.safeParse(jsonStringToObject(event.data));
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
      handleStreamEvent(streamEvent, queryClient);
    },
    [queryClient],
  );

  const authenticate = useCallback((ws: WebSocket) => {
    ws.send(`AUTH ${getIdTokenGlobal()}`);
  }, []);

  useSubscription({
    url,
    // When abtCustomerId is set, we also have the id token which is needed to
    // authenticate.
    enabled: isEventStreamEnabled && abtCustomerId !== undefined,
    onMessage,
    onOpen: authenticate,
  });
};
