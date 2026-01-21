import {useTicketingContext} from '@atb/modules/ticketing';
import {getReservationStatus} from '@atb/modules/fare-contracts';
import {
  getFilterdFareContracts,
  useGetFareContractsQuery,
} from './use-fare-contracts';
import {AvailabilityStatus, FareContractType} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';

export const useGetHasReservationOrAvailableFareContract = () => {
  const availabilityStatus: AvailabilityStatus = {
    availability: 'available',
    status: 'valid',
  };
  const {reservations} = useTicketingContext();
  const {refetch: getFareContractsFromBackend} = useGetFareContractsQuery({
    enabled: false,
    availability: availabilityStatus.availability,
  });

  const getHasReservationOrAvailableFareContract = async () => {
    const fareContractsFromBackend = await getFareContractsFromBackend();
    if (!fareContractsFromBackend.isSuccess) {
      return false;
    }
    const parsedFareContracts = fareContractsFromBackend.data
      ?.map((fc) => FareContractType.safeParse(fc).data)
      .filter(isDefined);

    const availableFareContracts = getFilterdFareContracts(
      parsedFareContracts,
      availabilityStatus,
    );
    const hasAvailableFareContracts = availableFareContracts.length > 0;
    const hasNonRejectedReservations = reservations
      .map(getReservationStatus)
      .some((status) => status !== 'rejected');

    return hasAvailableFareContracts || hasNonRejectedReservations;
  };
  return getHasReservationOrAvailableFareContract;
};
