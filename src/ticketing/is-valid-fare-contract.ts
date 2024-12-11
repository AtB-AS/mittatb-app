import {type FareContract} from './types';
import {isValidRightNowTravelRight} from './utils';
import {isActiveFareContract} from './is-active-fare-contract';

/**
 * Check whether a fare contract is valid or not. A fare contract is considered
 * valid if all of these are true:
 * - Fare contract is active
 * - If carnet: Has any currently valid access
 * - If not carnet: Has any currently valid travel right
 * @see isActiveFareContract
 */
export const isValidFareContract = (fc: FareContract, now: number) =>
  isActiveFareContract(fc, now) &&
  fc.travelRights.some((tr) => isValidRightNowTravelRight(tr, now));
