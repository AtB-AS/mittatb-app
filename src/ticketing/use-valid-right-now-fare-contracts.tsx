import {useTimeContext} from '@atb/time';
import {
  useTicketingContext,
  filterValidRightNowFareContracts,
  FareContract,
} from '@atb/ticketing';
import {useMemo} from 'react';

export function useValidRightNowFareContract(): FareContract[] {
  const {serverNow} = useTimeContext();
  const {fareContracts} = useTicketingContext();
  return useMemo(
    () => filterValidRightNowFareContracts(fareContracts, serverNow),
    [serverNow, fareContracts],
  );
}
