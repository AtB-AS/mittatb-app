import {QueryClient} from '@tanstack/react-query';
import {EventKind, StreamEvent} from './types';
import {fareContractsQueryKey} from '../ticketing/use-fare-contracts';

export const handleStreamEvent = (
  streamEvent: StreamEvent,
  queryClient: QueryClient,
  featureToggles: {
    isEventStreamFareContractsEnabled?: boolean;
  },
) => {
  switch (streamEvent.event) {
    case EventKind.FareContract:
      if (!featureToggles.isEventStreamFareContractsEnabled) return;
      queryClient.invalidateQueries({
        queryKey: [fareContractsQueryKey],
      });
      break;
  }
};
