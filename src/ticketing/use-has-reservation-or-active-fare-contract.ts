import {useTicketingState} from '@atb/ticketing/TicketingContext';
import {useTimeContextState} from '@atb/time';
import {filterActiveOrCanBeUsedFareContracts} from '@atb/ticketing/utils';
import {getReservationStatus} from '@atb/fare-contracts/utils';

export const useHasReservationOrActiveFareContract = () => {
  const {fareContracts, reservations} = useTicketingState();
  const {serverNow} = useTimeContextState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );
  const hasActiveFareContracts = activeFareContracts.length > 0;
  const hasReservingReservations = reservations
    .map(getReservationStatus)
    .some((status) => status === 'reserving');

  return hasActiveFareContracts || hasReservingReservations;
};
