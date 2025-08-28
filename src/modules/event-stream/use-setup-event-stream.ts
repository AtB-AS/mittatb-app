import {useSubscription} from '@atb/api/use-subscription';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback} from 'react';
import {WS_API_BASE_URL} from '@env';
import {getIdTokenGlobal, useAuthContext} from '../auth';
import Bugsnag from '@bugsnag/react-native';
import {handleStreamEvent} from './handle-stream-event';
import {StreamEventSchema} from './types';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {jsonStringToObject} from '@atb/utils/object';

export const useSetupEventStream = () => {
  const queryClient = useQueryClient();
  const {userId, isValidIdToken} = useAuthContext();
  const {isEventStreamEnabled, isEventStreamFareContractsEnabled} =
    useFeatureTogglesContext();

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
      handleStreamEvent(streamEvent, queryClient, userId, {
        isEventStreamFareContractsEnabled,
      });
    },
    [queryClient, isEventStreamFareContractsEnabled, userId],
  );

  const authenticate = useCallback((ws: WebSocket) => {
    ws.send(`AUTH ${getIdTokenGlobal()}`);
  }, []);

  useSubscription({
    url,
    // When id token is valid, we connect to the stream
    enabled: isEventStreamEnabled && isValidIdToken,
    onMessage,
    onOpen: authenticate,
  });
};
