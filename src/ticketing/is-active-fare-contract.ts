import {type FareContract, FareContractState} from './types';
import {
  flattenCarnetTravelRightAccesses,
  isCarnet,
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
export const isActiveFareContract = (
  fc: FareContract,
  now: number,
): boolean => {
  const isInRequiredState =
    fc.state === FareContractState.Activated ||
    fc.state === FareContractState.NotActivated;
  if (!isInRequiredState) return false;

  if (hasNonExpiredAccesses(fc, now)) return true;

  const hasAnyUnexpiredTravelRights = fc.travelRights
    .filter(isNormalTravelRight)
    .some((tr) => tr.endDateTime.getTime() > now);

  if (isCarnet(fc)) {
    return (
      hasNonExpiredAccesses(fc, now) ||
      (hasAnyUnexpiredTravelRights && hasUnusedAccesses(fc))
    );
  } else {
    return hasAnyUnexpiredTravelRights;
  }
};

const hasNonExpiredAccesses = (fc: FareContract, now: number) => {
  const carnetTravelRights = fc.travelRights.filter(isCarnetTravelRight);
  const {usedAccesses} = flattenCarnetTravelRightAccesses(carnetTravelRights);
  return usedAccesses.some((ua) => ua.endDateTime.getTime() > now);
};

const hasUnusedAccesses = (fc: FareContract) => {
  const carnetTravelRights = fc.travelRights.filter(isCarnetTravelRight);
  const {maximumNumberOfAccesses, numberOfUsedAccesses} =
    flattenCarnetTravelRightAccesses(carnetTravelRights);
  return numberOfUsedAccesses < maximumNumberOfAccesses;
};
