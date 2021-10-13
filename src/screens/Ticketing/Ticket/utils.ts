import {FareContractState} from '@atb/tickets';

export type ValidityStatus =
  | 'reserving'
  | 'valid'
  | 'upcoming'
  | 'unknown'
  | 'refunded'
  | 'expired'
  | 'uninspectable';

export const getValidityStatus = (
  now: number,
  validFrom: number,
  validTo: number,
  state: FareContractState,
  inspectable: boolean,
): ValidityStatus => {
  if (state === FareContractState.Refunded) return 'refunded';
  if (now > validTo) return 'expired';
  if (now < validFrom) return 'upcoming';
  if (!inspectable) return 'uninspectable';
  return 'valid';
};
