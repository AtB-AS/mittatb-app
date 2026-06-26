import {useQueryClient} from '@tanstack/react-query';
import {EventKind} from './types';
import {useEventStreamListener} from './use-event-stream-listener';
import {getActiveShmoBookingQueryKey} from '../mobility/queries/use-active-shmo-booking-query';
import {getShmoBookingQueryKey} from '../mobility/queries/use-shmo-booking-query';
import {languageGlobal} from '../locale';
import {getBonusBalanceQueryKey} from '../bonus/queries/use-bonus-balance-query';
import {getBonusAmountEarnedQueryKey} from '../bonus';
import {useAuthContext} from '../auth';

/**
 * Registers app-wide event stream listeners that aren't tied to a specific
 * component or context.
 */
export function useGlobalEventStreamListeners() {
  const queryClient = useQueryClient();
  const {userId} = useAuthContext();

  useEventStreamListener(EventKind.ShmoBookingUpdated, (streamEvent) => {
    queryClient.invalidateQueries({
      queryKey: getActiveShmoBookingQueryKey(languageGlobal),
    });
    queryClient.invalidateQueries({
      queryKey: getShmoBookingQueryKey(streamEvent.bookingId, languageGlobal),
    });
  });

  useEventStreamListener(
    EventKind.PersonalisationProgramPoint,
    (streamEvent) => {
      queryClient.invalidateQueries({
        queryKey: getBonusBalanceQueryKey(userId),
      });
      queryClient.invalidateQueries({
        queryKey: getBonusAmountEarnedQueryKey(userId, streamEvent.orderId),
      });
    },
  );
}
