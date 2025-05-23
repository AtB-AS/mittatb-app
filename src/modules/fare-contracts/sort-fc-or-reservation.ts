import {Reservation} from '@atb/modules/ticketing';
import type {ValidityStatus} from './utils';
import {FareContractType} from '@atb-as/utils';

export const sortFcOrReservationByValidityAndCreation = (
  userId: string | undefined,
  now: number,
  fcOrReservations: (Reservation | FareContractType)[],
  getFareContractStatus: (
    now: number,
    fc: FareContractType,
    currentUserId?: string,
  ) => ValidityStatus | undefined,
): (FareContractType | Reservation)[] => {
  const getFcOrReservationOrder = (
    fcOrReservation: FareContractType | Reservation,
  ) => {
    const isFareContract = 'travelRights' in fcOrReservation;
    // Make reservations go first, then fare contracts
    if (!isFareContract) return -1;

    const validityStatus = getFareContractStatus(now, fcOrReservation, userId);
    return validityStatus === 'valid' ? 0 : 1;
  };

  return fcOrReservations.sort((a, b) => {
    const orderA = getFcOrReservationOrder(a);
    const orderB = getFcOrReservationOrder(b);
    // Negative return value for a - b means "place a before b"
    if (orderA !== orderB) return orderA - orderB;
    // Make sure most recent dates comes first
    return b.created.getTime() - a.created.getTime();
  });
};

export const sortFcOrReservationByCreation = (
  fcOrReservations: (Reservation | FareContractType)[],
): (FareContractType | Reservation)[] => {
  return fcOrReservations.sort((a, b) => {
    // Make sure most recent dates comes first
    return b.created.getTime() - a.created.getTime();
  });
};
