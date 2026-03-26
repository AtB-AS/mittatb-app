import {useMemo} from 'react';
import {useTicketingContext} from '@atb/modules/ticketing';
import {getReservationStatus} from '@atb/modules/fare-contracts';
import {
  getFilterdFareContracts,
  useGetFareContractsQuery,
} from './use-fare-contracts';
import {FareContractType} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';

export const useGetHasReservationOrAvailableFareContract = () => {
  const {reservations} = useTicketingContext();

  const {data: fareContracts} = useGetFareContractsQuery({
    enabled: true,
    availability: 'available',
  });

  const hasReservationOrAvailableFareContract = useMemo(
    () => () => {
      const parsedFareContracts =
        fareContracts
          ?.map((fc) => FareContractType.safeParse(fc).data)
          .filter(isDefined) ?? [];

      const validFareContracts = getFilterdFareContracts(parsedFareContracts, {
        availability: 'available',
        status: 'valid',
      });
      const hasValidFareContracts = validFareContracts.length > 0;

      const upcomingFareContracts = getFilterdFareContracts(
        parsedFareContracts,
        {availability: 'available', status: 'upcoming'},
      );
      const hasUpcomingFareContracts = upcomingFareContracts.length > 0;

      const hasNonRejectedReservations = reservations
        .map(getReservationStatus)
        .some((status) => status !== 'rejected');

      return (
        hasValidFareContracts ||
        hasUpcomingFareContracts ||
        hasNonRejectedReservations
      );
    },
    [fareContracts, reservations],
  );

  return hasReservationOrAvailableFareContract;
};
