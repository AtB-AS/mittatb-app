import {Reservation} from '@atb/modules/ticketing';
import {isDefined} from '@atb/utils/presence';
import {FareContractInfo} from './use-fare-contract-info';

export const getSortedFareContractsAndReservations = (
  fareContracts: FareContractInfo[],
  reservations: Reservation[],
  now: number,
): (FareContractInfo | Reservation)[] => {
  // Should show only the most recent "failed" reservation.
  const sortedReservations = sortFcOrReservationByCreation(reservations);
  const mostRecentFailedReservation = sortedReservations.find(
    (reservation) =>
      'paymentStatus' in reservation &&
      (reservation.paymentStatus === 'CANCEL' ||
        reservation.paymentStatus === 'REJECT'),
  );

  const otherReservations = reservations.filter(
    (r) => r.paymentStatus !== 'CANCEL' && r.paymentStatus !== 'REJECT',
  );

  const validFareContracts = fareContracts.filter((fc) => {
    return fc.getAvailabilityStatus(now).status === 'valid';
  });

  // Non-valid fare contracts (e.g. inactive carnets) should come last, and be
  // sorted by creation date.
  const otherFareContracts = sortFcOrReservationByCreation(
    fareContracts.filter(
      (fc) => fc.getAvailabilityStatus(now).status !== 'valid',
    ),
  );

  // Sort everything but the non-valid fare contracts by creation date.
  const sortedFareContractsAndReservations = sortFcOrReservationByCreation(
    [
      mostRecentFailedReservation,
      ...otherReservations,
      ...validFareContracts,
    ].filter(isDefined),
  );

  return [...sortedFareContractsAndReservations, ...otherFareContracts];
};

export const sortFcOrReservationByCreation = (
  fcOrReservations: (Reservation | FareContractInfo)[],
): (FareContractInfo | Reservation)[] => {
  return fcOrReservations.sort((a, b) => {
    // Make sure most recent dates comes first
    return b.created.getTime() - a.created.getTime();
  });
};
