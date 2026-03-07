import {QueryClient} from '@tanstack/react-query';
import {EventKind, StreamEvent} from './types';
import {fareContractsQueryKey} from '../ticketing/use-fare-contracts';
import {getBonusAmountEarnedQueryKey} from '../bonus';
import {getActiveShmoBookingQueryKey} from '../mobility/queries/use-active-shmo-booking-query';
import {getShmoBookingQueryKey} from '../mobility/queries/use-shmo-booking-query';
import {languageGlobal} from '../locale';
import {getBonusBalanceQueryKey} from '../bonus/queries/use-bonus-balance-query';

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
      if (featureToggles.isEventStreamFareContractsEnabled) {
        queryClient.invalidateQueries({
          queryKey: [fareContractsQueryKey],
        });
      }
      break;
    case EventKind.ShmoBookingUpdated:
      queryClient.invalidateQueries({
        queryKey: getActiveShmoBookingQueryKey(languageGlobal),
      });
      queryClient.invalidateQueries({
        queryKey: getShmoBookingQueryKey(streamEvent.bookingId, languageGlobal),
      });
      break;
    case EventKind.PersonalisationProgramPoint:
      queryClient.invalidateQueries({
        queryKey: getBonusBalanceQueryKey(userId),
      });
      queryClient.invalidateQueries({
        queryKey: getBonusAmountEarnedQueryKey(userId, streamEvent.orderId),
      });
      break;
  }
};
