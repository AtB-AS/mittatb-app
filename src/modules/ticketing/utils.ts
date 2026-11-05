import {last, sortBy, startCase} from 'lodash';
import {
  LastUsedAccessState,
  UsedAccessStatus,
  PaymentAgreement,
  PaymentAgreementStatus,
  PaymentType,
  ConsumableSchoolCarnetResponse,
} from './types';
import {FareContractType, TravelRightType, UsedAccessType} from '@atb-as/utils';
import {getAvailabilityStatus} from '@atb-as/utils';
import {parseDate} from '@atb/utils/date';

export function isSentOrReceivedFareContract(fc: FareContractType) {
  return fc.customerAccountId !== fc.purchasedBy;
}

export function isCanBeConsumedNowFareContract(
  f: FareContractType,
  now: number,
  currentUserId: string | undefined,
  schoolCarnetInfo: ConsumableSchoolCarnetResponse | undefined,
) {
  if (f.customerAccountId !== currentUserId) return false;

  // If there is a next consumable date time, it cannot be consumed
  if (schoolCarnetInfo?.nextConsumableDateTime) return false;

  // Fare contracts without accesses cannot be consumed
  if (!hasTravelRightAccesses(f.travelRights)) return false;

  return getAvailabilityStatus(f, now).status === 'upcoming';
}

export function isCanBeActivatedNowFareContract(
  f: FareContractType,
  now: number,
  currentUserId: string | undefined,
  isBooking: boolean = false,
) {
  if (f.customerAccountId !== currentUserId) return false;

  // You cannot activate a booking fare contract early
  if (isBooking) return false;

  // A fare contract with accesses (carnets) cannot be activated by itself. It
  // is instead "consumed" to activate an access
  if (hasTravelRightAccesses(f.travelRights)) return false;

  return getAvailabilityStatus(f, now).status === 'upcoming';
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
    case PaymentType.ApplePay:
      return 'Apple Pay';
    case PaymentType.GooglePay:
      return 'Google Pay';
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
    case 'apple_pay':
      return 'Apple Pay';
    case 'google_pay':
      return 'Google Pay';
    default:
      return startCase(paymentType.toLowerCase());
  }
}

/** Payment types that payment agreements can be created for */
export const SUPPORTED_PAYMENT_AGREEMENT_TYPES = [PaymentType.Vipps];

export function isPaymentAgreementSupported(
  paymentType: PaymentType | undefined,
): paymentType is PaymentType {
  return (
    !!paymentType && SUPPORTED_PAYMENT_AGREEMENT_TYPES.includes(paymentType)
  );
}

export function getLatestPaymentAgreement(
  paymentAgreements: PaymentAgreement[] | undefined,
  paymentType: PaymentType,
): PaymentAgreement | undefined {
  const agreementsOfType = (paymentAgreements ?? []).filter(
    (agreement) => agreement.paymentType === paymentType,
  );
  return last(
    sortBy(agreementsOfType, (agreement) =>
      parseDate(agreement.updatedAt ?? agreement.createdAt).getTime(),
    ),
  );
}

const PENDING_PAYMENT_AGREEMENT_STATUSES = [
  PaymentAgreementStatus.Created,
  PaymentAgreementStatus.Pending,
];

/**
 * The supported payment agreements that are still being created, e.g. waiting
 * for the user to accept them in Vipps.
 */
export function getPendingPaymentAgreements(
  paymentAgreements: PaymentAgreement[] | undefined,
): PaymentAgreement[] {
  return (paymentAgreements ?? []).filter(
    (paymentAgreement) =>
      PENDING_PAYMENT_AGREEMENT_STATUSES.includes(paymentAgreement.status) &&
      isPaymentAgreementSupported(paymentAgreement.paymentType),
  );
}
