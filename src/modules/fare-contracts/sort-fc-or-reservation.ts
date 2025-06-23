import {Reservation} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';

export const useFareContractsAndReservationsSorted = (
  fcOrReservations: (Reservation | FareContractType)[],
): (FareContractType | Reservation)[] => {
  let keepFailed = true;
  return fcOrReservations
    .sort((a, b) => b.created.getTime() - a.created.getTime())
    .filter(
      (item) =>
        'travelRights' in item ||
        (item.paymentStatus !== 'CANCEL' && item.paymentStatus !== 'REJECT') ||
        (keepFailed && (keepFailed = false)),
    );
};

export const sortFcOrReservationByCreation = (
  fcOrReservations: (Reservation | FareContractType)[],
): (FareContractType | Reservation)[] => {
  return fcOrReservations.sort((a, b) => {
    // Make sure most recent dates comes first
    return b.created.getTime() - a.created.getTime();
  });
};
