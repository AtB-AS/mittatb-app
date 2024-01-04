import {useTimeContextState} from '@atb/time';
import {
  useTicketingState,
  filterValidRightNowFareContract,
  FareContract,
} from '@atb/ticketing';

export function useValidRightNowFareContract(): FareContract[] {
  const {serverNow} = useTimeContextState();
  const {fareContracts} = useTicketingState();

  return filterValidRightNowFareContract(fareContracts, serverNow);
}
