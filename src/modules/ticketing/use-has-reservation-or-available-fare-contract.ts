import {useTicketingContext} from '@atb/modules/ticketing';
import {useTimeContext} from '@atb/modules/time';
import {getReservationStatus} from '@atb/modules/fare-contracts';
import {useFareContracts} from '@atb/modules/ticketing';

export const useHasReservationOrAvailableFareContract = () => {
  const {reservations} = useTicketingContext();
  const {serverNow} = useTimeContext();
  const {fareContracts: availableFareContracts} = useFareContracts(
    {availability: 'available'},
    serverNow,
  );
  const hasAvailableFareContracts = availableFareContracts.length > 0;
  const hasNonRejectedReservations = reservations
    .map(getReservationStatus)
    .some((status) => status !== 'rejected');

  return hasAvailableFareContracts || hasNonRejectedReservations;
};
