import {useTicketingContext} from '@atb/ticketing/TicketingContext';
import type {AvailabilityStatus, FareContract} from '@atb/ticketing/types';
import {getAvailabilityStatus} from '@atb/ticketing/get-availability-status';
import type {PartialField} from '@atb/utils/object';

export const useFareContracts = (
  availabilityStatus: PartialField<AvailabilityStatus, 'status'>,
  now: number,
): {fareContracts: FareContract[]} => {
  const {fareContracts: fareContractsFromFirestore} = useTicketingContext();
  const fareContracts = fareContractsFromFirestore.filter((fc) => {
    const as = getAvailabilityStatus(fc, now);
    if (as.availability === availabilityStatus.availability) {
      return availabilityStatus.status
        ? as.status === availabilityStatus.status
        : true;
    }

    return false;
  });

  return {fareContracts};
};
