import {LegMode, TransportSubmode, TripPattern} from '@atb/sdk';
import {AUTHORITY} from '@env';

const currentAppAuthorityId = AUTHORITY ?? 'ATB:Authority:2';

export function hasLegsWeCantSellTicketsFor(
  tripPattern: TripPattern,
  validModes: string[],
) {
  return tripPattern.legs.some(function (leg) {
    if (leg.mode == LegMode.FOOT) {
      return false;
    }
    if (leg.authority?.id !== currentAppAuthorityId) {
      return true;
    }
    return !validModes.includes(leg.transportSubmode);
  });
}

// @TODO Should be updated to take Authority ID.
export function canSellTicketsForSubMode(
  subMode: TransportSubmode | undefined,
  validModes: string[],
) {
  return !subMode || validModes.includes(subMode);
}
