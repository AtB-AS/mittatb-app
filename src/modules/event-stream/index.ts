import {useSubscription} from '@atb/api/use-subscription';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback} from 'react';
import {fareContractsQueryKey} from '../ticketing/use-fare-contracts';

enum EventKind {
  FareContractEvent = 'FareContract',
}

export const useSetupEvents = () => {
  const url = '/event-stream/v1';
  const queryClient = useQueryClient();

  const onMessage = useCallback(
    (event: WebSocketMessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.kind === EventKind.FareContractEvent) {
        queryClient.invalidateQueries({
          queryKey: [fareContractsQueryKey],
        });
      }
    },
    [queryClient],
  );

  useSubscription({
    url,
    enabled: true,
    onError: (error) => {
      console.log('Error subscribing to event stream:', error);
    },
    onMessage,
  });
};
