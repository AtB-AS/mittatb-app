import {useTimeContextState} from '@atb/time';
import {
  useTicketingState,
  filterValidRightNowFareContracts,
  FareContract,
} from '@atb/ticketing';
import {useMemo} from 'react';

export function useValidRightNowFareContract(): FareContract[] {
  const {serverNow} = useTimeContextState();
  const {fareContracts} = useTicketingState();
  return useMemo(
    () => filterValidRightNowFareContracts(fareContracts, serverNow),
    [serverNow, fareContracts],
  );
}
