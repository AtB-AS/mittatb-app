import {QueryClient} from '@tanstack/react-query';
import {EventKind, StreamEvent} from './types';
import {fareContractsQueryKey} from '../ticketing/use-fare-contracts';

export const handleStreamEvent = (
  streamEvent: StreamEvent,
  queryClient: QueryClient,
) => {
  switch (streamEvent.event) {
    case EventKind.FareContract:
      queryClient.invalidateQueries({
        queryKey: [fareContractsQueryKey],
      });
      break;
  }
};
