import {
  type AvailabilityStatus,
  type FareContract,
  FareContractState,
} from './types';
import {flattenTravelRightAccesses} from './utils';

/**
 * Get availability status of a fare contract
 *
 * @see https://github.com/AtB-AS/docs-private/blob/main/terminology.md#ticketing
 */
export const getAvailabilityStatus = (
  fc: FareContract,
  now: number,
): AvailabilityStatus => {
  if (fc.state === FareContractState.Refunded) {
    return {availability: 'historical', status: 'refunded'};
  }

  if (fc.state === FareContractState.Cancelled) {
    return {availability: 'historical', status: 'cancelled'};
  }

  if (fc.state === FareContractState.Unspecified) {
    return {availability: 'invalid', status: 'unspecified'};
  }

  if (!fc.travelRights.length) {
    return {availability: 'invalid', status: 'invalid'};
  }

  const flattenedAccesses = flattenTravelRightAccesses(fc.travelRights);
  if (flattenedAccesses) {
    const {usedAccesses, maximumNumberOfAccesses, numberOfUsedAccesses} =
      flattenedAccesses;
    if (usedAccesses.some(isValid(now))) {
      return {availability: 'available', status: 'valid'};
    } else if (numberOfUsedAccesses >= maximumNumberOfAccesses) {
      return {availability: 'historical', status: 'empty'};
    } else if (fc.travelRights.every(isExpired(now))) {
      return {availability: 'historical', status: 'expired'};
    } else {
      return {availability: 'available', status: 'upcoming'};
    }
  } else {
    if (fc.travelRights.every(isExpired(now))) {
      return {availability: 'historical', status: 'expired'};
    } else if (fc.travelRights.some(isValid(now))) {
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
