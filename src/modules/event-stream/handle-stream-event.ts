import {QueryClient} from '@tanstack/react-query';
import {EventKind, StreamEvent} from './types';
import {fareContractsQueryKey} from '../ticketing/use-fare-contracts';
import {getBonusAmountEarnedQueryKey} from '../bonus';
import {getActiveShmoBookingQueryKey} from '../mobility/queries/use-active-shmo-booking-query';
import {getShmoBookingQueryKey} from '../mobility/queries/use-shmo-booking-query';

export const handleStreamEvent = (
  streamEvent: StreamEvent,
  queryClient: QueryClient,
  userId: string | undefined,
  featureToggles: {
    isEventStreamFareContractsEnabled?: boolean;
  },
) => {
  switch (streamEvent.event) {
    case EventKind.FareContract:
      queryClient.invalidateQueries({
        queryKey: getBonusAmountEarnedQueryKey(
          userId,
          streamEvent.fareContractId,
        ),
      });
      if (featureToggles.isEventStreamFareContractsEnabled) {
        queryClient.invalidateQueries({
          queryKey: [fareContractsQueryKey],
        });
      }
      break;
    case EventKind.ShmoBookingUpdate:
      queryClient.invalidateQueries({
        queryKey: getActiveShmoBookingQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getShmoBookingQueryKey(streamEvent.bookingId),
      });
      break;
  }
};
