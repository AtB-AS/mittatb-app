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
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

export const useSetupEventStream = () => {
  const queryClient = useQueryClient();
  const {authStatus} = useAuthContext();
  const appState = useAppStateStatus();
  const {isEventStreamEnabled, isEventStreamFareContractsEnabled} =
    useFeatureTogglesContext();

  const url = `${WS_API_BASE_URL}stream/v1`;

  // Similar to what's done in `useRefreshIdTokenWhenNecessary`, to ensure the id
  // token is kept up to date.
  const enabled =
    isEventStreamEnabled &&
    appState === 'active' &&
    authStatus === 'authenticated';

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
      handleStreamEvent(streamEvent, queryClient, {
        isEventStreamFareContractsEnabled,
      });
    },
    [queryClient, isEventStreamFareContractsEnabled],
  );

  const authenticate = useCallback((ws: WebSocket) => {
    ws.send(`AUTH ${getIdTokenGlobal()}`);
  }, []);

  useSubscription({
    url,
    enabled,
    onMessage,
    onOpen: authenticate,
  });
};
