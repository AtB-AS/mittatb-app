import {useTicketingState} from '@atb/ticketing/TicketingContext';
import type {AvailabilityStatus, FareContract} from '@atb/ticketing/types';
import {getAvailabilityStatus} from '@atb/ticketing/get-availability-status';
import type {PartialField} from '@atb/utils/object';

export const useFareContracts = (
  availabilityStatus: PartialField<AvailabilityStatus, 'status'>,
  now: number,
): FareContract[] => {
  const {fareContracts} = useTicketingState();
  return fareContracts.filter((fc) => {
    const as = getAvailabilityStatus(fc, now);
    if (as.availability === availabilityStatus.availability) {
      if (!availabilityStatus) return true;
      return as.status === availabilityStatus.status;
    }

    return false;
  });
};
