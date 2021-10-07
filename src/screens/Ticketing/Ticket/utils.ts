import {FareContractState} from '@atb/tickets';

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
  if (now > validTo) return 'expired';
  if (now < validFrom) return 'upcoming';
  return 'valid';
}
