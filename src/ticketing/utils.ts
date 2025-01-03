import {flatten, sumBy, startCase} from 'lodash';
import {
  FareContract,
  CarnetTravelRight,
  TravelRight,
  CarnetTravelRightUsedAccess,
  LastUsedAccessState,
  UsedAccessStatus,
  NormalTravelRight,
  PaymentType,
} from './types';
import {getAvailabilityStatus} from '@atb/ticketing/get-availability-status';

export function isCarnetTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is CarnetTravelRight {
  return !!travelRight && 'maximumNumberOfAccesses' in travelRight;
}

export function isCarnet(fareContract: FareContract): boolean {
  return fareContract.travelRights.some(isCarnetTravelRight);
}

export function isNormalTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is NormalTravelRight {
  return (
    !!travelRight &&
    'startDateTime' in travelRight &&
    !!travelRight.startDateTime
  );
}

export function isSentOrReceivedFareContract(fc: FareContract) {
  return fc.customerAccountId !== fc.purchasedBy;
}

type FlattenedCarnetTravelRights = {
  usedAccesses: CarnetTravelRightUsedAccess[];
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};

export function flattenCarnetTravelRightAccesses(
  travelRights: CarnetTravelRight[],
): FlattenedCarnetTravelRights {
  const allUsedAccesses = travelRights.map((t) => t.usedAccesses ?? []);
  const usedAccesses = flatten(allUsedAccesses).sort(
    (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime(),
  );
  const maximumNumberOfAccesses = sumBy(
    travelRights,
    (t) => t.maximumNumberOfAccesses,
  );
  const numberOfUsedAccesses = sumBy(
    travelRights,
    (t) => t.numberOfUsedAccesses,
  );
  return {
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  };
}

export function isCanBeConsumedNowFareContract(
  f: FareContract,
  now: number,
  currentUserId: string | undefined,
) {
  if (f.customerAccountId !== currentUserId) return false;
  if (!isCarnet(f)) return false;
  return getAvailabilityStatus(f, now).status === 'upcoming';
}

export function isCanBeActivatedNowFareContract(
  f: FareContract,
  now: number,
  currentUserId: string | undefined,
) {
  if (f.customerAccountId !== currentUserId) return false;
  if (isCarnet(f)) return false;
  return getAvailabilityStatus(f, now).status === 'upcoming';
}

export function getLastUsedAccess(
  now: number,
  usedAccesses: CarnetTravelRightUsedAccess[],
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
