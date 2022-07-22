import {FareContractState} from '@atb/tickets';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {UserProfile} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/screens/Ticketing/Purchase/Travellers/use-user-count-state';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {RemoteToken} from '@atb/mobile-token/types';
import {TicketTexts, TranslateFunction} from '@atb/translations';
import {
  findInspectable,
  getDeviceName,
  isMobileToken,
  isTravelCardToken,
} from '@atb/mobile-token/utils';

export type RelativeValidityStatus = 'upcoming' | 'valid' | 'expired';

export type ValidityStatus =
  | RelativeValidityStatus
  | 'reserving'
  | 'unknown'
  | 'refunded';

export function getRelativeValidity(
  now: number,
  validFrom: number,
  validTo: number,
): RelativeValidityStatus {
  if (now > validTo) return 'expired';
  if (now < validFrom) return 'upcoming';

  return 'valid';
}

export function getValidityStatus(
  now: number,
  validFrom: number,
  validTo: number,
  state: FareContractState,
): ValidityStatus {
  if (state === FareContractState.Refunded) return 'refunded';
  return getRelativeValidity(now, validFrom, validTo);
}

export const getTransportationModes = (ticketType?: string) => {
  switch (ticketType) {
    case 'single':
    case 'hour24':
    case 'period':
      return [{mode: Mode.Bus, subMode: TransportSubmode.LocalBus}];
    case 'summerPass': //TODO cross check this value
      return [
        {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
        {mode: Mode.Rail},
        {mode: Mode.Water},
      ];
    default:
      return null;
  }
};

export const mapToUserProfilesWithCount = (
  userProfileRefs: string[],
  userProfiles: UserProfile[],
): UserProfileWithCount[] =>
  userProfileRefs
    .reduce((groupedById, userProfileRef) => {
      const existing = groupedById.find(
        (r) => r.userProfileRef === userProfileRef,
      );
      if (existing) {
        existing.count += 1;
        return groupedById;
      }
      return [...groupedById, {userProfileRef, count: 1}];
    }, [] as {userProfileRef: string; count: number}[])
    .map((refAndCount) => {
      const userProfile = findReferenceDataById(
        userProfiles,
        refAndCount.userProfileRef,
      );
      return {
        ...userProfile,
        count: refAndCount.count,
      };
    })
    .filter(
      (userProfileWithCount): userProfileWithCount is UserProfileWithCount =>
        'id' in userProfileWithCount,
    );

export const getNonInspectableTokenWarning = (
  isError: boolean,
  fallbackEnabled: boolean,
  t: TranslateFunction,
  remoteTokens?: RemoteToken[],
  isInspectable?: boolean,
) => {
  const inspectableToken = findInspectable(remoteTokens);
  if (isError && fallbackEnabled) return null;

  if (isError) return t(TicketTexts.warning.unableToRetrieveToken);
  if (!inspectableToken) return t(TicketTexts.warning.noInspectableTokenFound);
  if (isTravelCardToken(inspectableToken))
    return t(TicketTexts.warning.travelCardAstoken);
  if (isMobileToken(inspectableToken) && !isInspectable)
    return t(
      TicketTexts.warning.anotherMobileAsToken(
        getDeviceName(inspectableToken) || t(TicketTexts.warning.unnamedDevice),
      ),
    );
};

export const isValidTicket = (status: ValidityStatus) => status === 'valid';
