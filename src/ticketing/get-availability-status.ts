import {
  type AvailabilityStatus,
  type FareContract,
  FareContractState,
} from './types';
import {
  flattenCarnetTravelRightAccesses,
  isCarnetTravelRight,
  isNormalTravelRight,
} from './utils';

/**
 * Check whether a fare contract is active or not. A fare contract is considered active
 * if all of these are true:
 * - Fare contract state is 'Activated' or 'NotActivated'
 * - If carnet: Has non-expired access, or non-expired travel right in combination with unused access(es)
 * - If not carnet: Has any non-expired travel right
 */
export const getAvailabilityStatus = (
  fc: FareContract,
  now: number,
): AvailabilityStatus => {
  if (fc.state === FareContractState.Refunded) {
    return {availability: 'historic', status: 'refunded'};
  }

  if (fc.state === FareContractState.Cancelled) {
    return {availability: 'historic', status: 'cancelled'};
  }

  if (fc.state === FareContractState.Unspecified) {
    return {availability: 'invalid', status: 'unspecified'};
  }

  const travelRights = fc.travelRights.filter(isNormalTravelRight);
  if (!travelRights.length) {
    return {availability: 'invalid', status: 'invalid'};
  }

  const carnetTravelRights = travelRights.filter(isCarnetTravelRight);
  if (carnetTravelRights.length) {
    const {usedAccesses, numberOfUsedAccesses, maximumNumberOfAccesses} =
      flattenCarnetTravelRightAccesses(carnetTravelRights);
    if (usedAccesses.some(isValid(now))) {
      return {availability: 'available', status: 'valid'};
    } else if (numberOfUsedAccesses >= maximumNumberOfAccesses) {
      return {availability: 'historic', status: 'empty'};
    } else if (travelRights.every(isExpired(now))) {
      return {availability: 'historic', status: 'expired'};
    } else {
      return {availability: 'available', status: 'upcoming'};
    }
  } else {
    if (travelRights.every(isExpired(now))) {
      return {availability: 'historic', status: 'expired'};
    } else if (travelRights.some(isValid(now))) {
      return {availability: 'available', status: 'valid'};
    } else {
      return {availability: 'available', status: 'upcoming'};
    }
  }
};

const isExpired =
  (now: number) =>
  (entity: {endDateTime: Date}): boolean =>
    entity.endDateTime.getTime() < now;

const isValid =
  (now: number) =>
  (entity: {startDateTime: Date; endDateTime: Date}): boolean =>
    entity.startDateTime.getTime() < now && entity.endDateTime.getTime() > now;
