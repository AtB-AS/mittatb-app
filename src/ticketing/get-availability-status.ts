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
      return {availability: 'historical', status: 'empty'};
    } else if (travelRights.every(isExpired(now))) {
      return {availability: 'historical', status: 'expired'};
    } else {
      return {availability: 'available', status: 'upcoming'};
    }
  } else {
    if (travelRights.every(isExpired(now))) {
      return {availability: 'historical', status: 'expired'};
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
