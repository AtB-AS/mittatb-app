import {TripPattern} from '@atb/api/types/trips';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {AUTHORITY} from '@env';

const currentAppAuthorityId = AUTHORITY ?? 'ATB:Authority:2';

export function hasLegsWeCantSellTicketsFor(
  tripPattern: TripPattern,
  validModes: string[],
) {
  return tripPattern.legs.some(function (leg) {
    if (leg.mode == Mode.Foot) {
      return false;
    }
    if (leg.authority?.id !== currentAppAuthorityId) {
      return true;
    }
    return !validModes.includes(leg.transportSubmode ?? 'n/a');
  });
}

// @TODO Should be updated to take Authority ID.
export function canSellTicketsForSubMode(
  subMode: TransportSubmode | undefined,
  validModes: string[],
) {
  return !subMode || validModes.includes(subMode);
}
