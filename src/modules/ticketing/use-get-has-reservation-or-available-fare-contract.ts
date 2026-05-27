import {useMemo} from 'react';
import {useTicketingContext} from '@atb/modules/ticketing';
import {getReservationStatus} from '@atb/modules/fare-contracts';
import {getFilterdFareContracts, useFareContracts} from './use-fare-contracts';
import {FareContractType} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';
import {useTimeContext} from '../time';

export const useGetHasReservationOrAvailableFareContract = () => {
  const {reservations} = useTicketingContext();
  const {serverNow} = useTimeContext();
  const {fareContracts} = useFareContracts(
    {availability: 'available', status: 'valid'},
    serverNow,
  );

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
