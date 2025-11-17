import {startCase} from 'lodash';
import {LastUsedAccessState, UsedAccessStatus, PaymentType} from './types';
import {TravelRightType, UsedAccessType} from '@atb-as/utils';
import {FareContractInfo} from '../fare-contracts/use-fare-contract-info';

export function isCanBeConsumedNowFareContract(
  f: FareContractInfo,
  now: number,
  currentUserId: string | undefined,
) {
  if (f.customerAccountId !== currentUserId) return false;

  // Fare contracts without accesses cannot be consumed
  if (!f.hasTravelRightAccesses) return false;

  return f.getAvailabilityStatus(now).status === 'upcoming';
}

export function isCanBeActivatedNowFareContract(
  f: FareContractInfo,
  now: number,
  currentUserId: string | undefined,
) {
  if (f.customerAccountId !== currentUserId) return false;

  // You cannot activate a booking fare contract early
  if (f.mostSignificantTicket.isBookingEnabled) return false;

  // A fare contract with accesses (carnets) cannot be activated by itself. It
  // is instead "consumed" to activate an access
  if (f.hasTravelRightAccesses) return false;

  return f.getAvailabilityStatus(now).status === 'upcoming';
}

export function getLastUsedAccess(
  now: number,
  usedAccesses: UsedAccessType[],
): LastUsedAccessState {
  const lastUsedAccess = usedAccesses.slice(-1).pop();

  let status: UsedAccessStatus = 'inactive';
  let validFrom: number | undefined = undefined;
  let validTo: number | undefined = undefined;

  if (lastUsedAccess) {
    validFrom = lastUsedAccess.startDateTime.getTime();
    validTo = lastUsedAccess.endDateTime.getTime();
    status = getUsedAccessValidity(now, validFrom, validTo);
  }

  return {status, validFrom, validTo};
}

function getUsedAccessValidity(
  now: number,
  validFrom: number,
  validTo: number,
): UsedAccessStatus {
  if (now > validTo) return 'inactive';
  if (now < validFrom) return 'upcoming';
  return 'valid';
}

export function hasTravelRightAccesses(travelRights: TravelRightType[]) {
  return travelRights.some((tr) => tr.maximumNumberOfAccesses !== undefined);
}

export function humanizePaymentType(paymentType: PaymentType) {
  switch (paymentType) {
    case PaymentType.Visa:
      return 'Visa';
    case PaymentType.Mastercard:
      return 'MasterCard';
    case PaymentType.Vipps:
      return 'Vipps';
    case PaymentType.Amex:
      return 'American Express';
    default:
      return '';
  }
}

export function humanizePaymentTypeString(paymentType: string) {
  switch (paymentType.toLowerCase()) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'MasterCard';
    case 'vipps':
      return 'Vipps';
    case 'amex':
      return 'American Express';
    default:
      return startCase(paymentType);
  }
}
