import {Reservation} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';

export const getSortedFareContractsAndReservations = (
  fcOrReservations: (Reservation | FareContractType)[],
): (FareContractType | Reservation)[] => {
  let fcFound = false;
  return sortFcOrReservationByCreation(fcOrReservations).filter((item) =>
    'travelRights' in item
      ? (fcFound = true)
      : !(
          (item.paymentStatus === 'CANCEL' ||
            item.paymentStatus === 'REJECT') &&
          fcFound
        ),
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
