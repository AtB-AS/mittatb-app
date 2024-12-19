import {useTicketingContext} from '@atb/ticketing/TicketingContext';
import {useTimeContext} from '@atb/time';
import {filterActiveOrCanBeUsedFareContracts} from '@atb/ticketing/utils';
import {getReservationStatus} from '@atb/fare-contracts/utils';

export const useHasReservationOrActiveFareContract = () => {
  const {fareContracts, reservations} = useTicketingContext();
  const {serverNow} = useTimeContext();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );
  const hasActiveFareContracts = activeFareContracts.length > 0;
  const hasNonRejectedReservations = reservations
    .map(getReservationStatus)
    .some((status) => status !== 'rejected');

  return hasActiveFareContracts || hasNonRejectedReservations;
};
