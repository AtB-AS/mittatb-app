import {useTicketingState} from '@atb/ticketing/TicketingContext';
import {useTimeContextState} from '@atb/time';
import {filterActiveOrCanBeUsedFareContracts} from '@atb/ticketing/utils';

export const useHasReservationOrActiveFareContract = () => {
  const {fareContracts, reservations} = useTicketingState();
  const {serverNow} = useTimeContextState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );
  const hasActiveFareContracts = activeFareContracts.length > 0;
  const hasReservations = reservations.length > 0;

  return hasActiveFareContracts || hasReservations;
};
