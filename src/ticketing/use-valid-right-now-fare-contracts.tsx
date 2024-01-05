import {useTimeContextState} from '@atb/time';
import {
  useTicketingState,
  filterValidRightNowFareContracts,
  FareContract,
} from '@atb/ticketing';

export function useValidRightNowFareContract(): FareContract[] {
  const {serverNow} = useTimeContextState();
  const {fareContracts} = useTicketingState();

  return filterValidRightNowFareContracts(fareContracts, serverNow);
}
