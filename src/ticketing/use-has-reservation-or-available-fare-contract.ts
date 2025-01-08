import {useTicketingContext} from '@atb/ticketing/TicketingContext';
import {useTimeContext} from '@atb/time';
import {getReservationStatus} from '@atb/fare-contracts/utils';
import {useFareContracts} from '@atb/ticketing/use-fare-contracts';

export const useHasReservationOrAvailableFareContract = () => {
  const {reservations} = useTicketingContext();
  const {serverNow} = useTimeContext();
  const availableFareContracts = useFareContracts(
    {availability: 'available'},
    serverNow,
  );
  const hasAvailableFareContracts = availableFareContracts.length > 0;
  const hasNonRejectedReservations = reservations
    .map(getReservationStatus)
    .some((status) => status !== 'rejected');

  return hasAvailableFareContracts || hasNonRejectedReservations;
};
