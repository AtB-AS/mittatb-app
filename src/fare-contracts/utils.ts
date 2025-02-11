import {
  FareContract,
  Reservation,
  FareContractState,
  flattenTravelRightAccesses,
  isSentOrReceivedFareContract,
  getLastUsedAccess,
  CarnetTravelRightUsedAccess,
  TravelRight,
} from '@atb/ticketing';
import {
  findReferenceDataById,
  getReferenceDataName,
  PreassignedFareProduct,
  TariffZone,
  useFirestoreConfigurationContext,
  UserProfile,
} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {
  FareContractTexts,
  Language,
  TariffZonesTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {useMobileTokenContext} from '@atb/mobile-token';
import {useCallback, useMemo} from 'react';
import {useAuthContext} from '@atb/auth';
import humanizeDuration from 'humanize-duration';
import type {UnitMapType} from '@atb/fare-contracts/types';

export type RelativeValidityStatus = 'upcoming' | 'valid' | 'expired';

export type ValidityStatus =
  | RelativeValidityStatus
  | 'reserving'
  | 'refunded'
  | 'cancelled'
  | 'inactive'
  | 'rejected'
  | 'approved'
  | 'sent';

export function getRelativeValidity(
  now: number,
  validFrom: number,
  validTo: number,
): RelativeValidityStatus {
  if (now > validTo) return 'expired';
  if (now < validFrom) return 'upcoming';

  return 'valid';
}

export const userProfileCountAndName = (
  u: UserProfileWithCount,
  language: Language,
) => `${u.count} ${getReferenceDataName(u, language)}`;

export function getValidityStatus(
  now: number,
  fc: FareContract,
  isSentFareContract?: boolean,
): ValidityStatus {
  if (fc.state === FareContractState.Refunded) return 'refunded';
  if (fc.state === FareContractState.Cancelled) return 'cancelled';
  if (isSentFareContract) return 'sent';

  const fareContractAccesses = flattenTravelRightAccesses(fc.travelRights);
  if (fareContractAccesses) {
    return getLastUsedAccess(now, fareContractAccesses.usedAccesses).status;
  } else {
    const firstTravelRight = fc.travelRights[0];
    return getRelativeValidity(
      now,
      firstTravelRight.startDateTime.getTime(),
      firstTravelRight.endDateTime.getTime(),
    );
  }
}

export const hasShmoBookingId = (fc: FareContract) => !!fc.bookingId;

export const useSortFcOrReservationByValidityAndCreation = (
  now: number,
  fcOrReservations: (Reservation | FareContract)[],
  getFareContractStatus: (
    now: number,
    fc: FareContract,
    currentUserId?: string,
  ) => ValidityStatus | undefined,
): (FareContract | Reservation)[] => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const getFcOrReservationOrder = useCallback(
    (fcOrReservation: FareContract | Reservation) => {
      const isFareContract = 'travelRights' in fcOrReservation;
      // Make reservations go first, then fare contracts
      if (!isFareContract) return -1;

      const validityStatus = getFareContractStatus(
        now,
        fcOrReservation,
        currentUserId,
      );
      return validityStatus === 'valid' ? 0 : 1;
    },
    [getFareContractStatus, now, currentUserId],
  );

  return useMemo(() => {
    return fcOrReservations.sort((a, b) => {
      const orderA = getFcOrReservationOrder(a);
      const orderB = getFcOrReservationOrder(b);
      // Negative return value for a - b means "place a before b"
      if (orderA !== orderB) return orderA - orderB;
      // Make sure most recent dates comes first
      return b.created.getTime() - a.created.getTime();
    });
  }, [fcOrReservations, getFcOrReservationOrder]);
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

export const useNonInspectableTokenWarning = () => {
  const {t} = useTranslation();
  const {mobileTokenStatus, tokens} = useMobileTokenContext();
  switch (mobileTokenStatus) {
    case 'success-and-inspectable':
    case 'fallback':
    case 'staticQr':
    case 'loading':
      return undefined;
    case 'error':
      return t(FareContractTexts.warning.errorWithToken);
    case 'success-not-inspectable':
      const inspectableToken = tokens.find((t) => t.isInspectable);
      return inspectableToken?.type === 'travel-card'
        ? t(FareContractTexts.warning.travelCardAsToken)
        : t(
            FareContractTexts.warning.anotherMobileAsToken(
              inspectableToken?.name ||
                t(FareContractTexts.warning.unnamedDevice),
            ),
          );
  }
};

export const useOtherDeviceIsInspectableWarning = () => {
  const {t} = useTranslation();
  const {mobileTokenStatus, tokens} = useMobileTokenContext();
  switch (mobileTokenStatus) {
    case 'success-and-inspectable':
    case 'fallback':
    case 'staticQr':
    case 'loading':
      return undefined;
    case 'error':
      return t(FareContractTexts.warning.errorWithToken);
    case 'success-not-inspectable':
      const inspectableToken = tokens.find((t) => t.isInspectable);
      const deviceName =
        inspectableToken?.name || t(FareContractTexts.warning.unnamedDevice);

      return inspectableToken?.type === 'travel-card'
        ? t(FareContractTexts.warning.tcardIsInspectableWarning)
        : t(
            FareContractTexts.warning.anotherPhoneIsInspectableWarning(
              deviceName,
            ),
          );
  }
};

export const useTariffZoneSummary = (
  preassignedFareProduct?: PreassignedFareProduct,
  fromTariffZone?: TariffZone,
  toTariffZone?: TariffZone,
) => {
  const {t, language} = useTranslation();
  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();

  if (!fromTariffZone || !toTariffZone) return undefined;

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );
  const zoneSelectionModeDisabledForProduct =
    fareProductTypeConfig?.configuration.zoneSelectionMode === 'none';
  if (zoneSelectionModeDisabledForProduct) return undefined;

  return tariffZonesSummary(fromTariffZone, toTariffZone, language, t);
};

export const isValidFareContract = (status: ValidityStatus) =>
  status === 'valid';

export function tariffZonesSummary(
  fromTariffZone: TariffZone,
  toTariffZone: TariffZone,
  language: Language,
  t: TranslateFunction,
): string {
  if (fromTariffZone.id === toTariffZone.id) {
    return t(
      TariffZonesTexts.zoneSummary.text.singleZone(
        getReferenceDataName(fromTariffZone, language),
      ),
    );
  } else {
    return t(
      TariffZonesTexts.zoneSummary.text.multipleZone(
        getReferenceDataName(fromTariffZone, language),
        getReferenceDataName(toTariffZone, language),
      ),
    );
  }
}

export const useDefaultPreassignedFareProduct = (
  preAssignedFareProducts: PreassignedFareProduct[],
): PreassignedFareProduct => {
  const defaultFareProduct = preAssignedFareProducts.find((p) => p.isDefault);

  if (defaultFareProduct) {
    return defaultFareProduct;
  }

  return preAssignedFareProducts[0];
};

type FareContractInfoProps = {
  travelRights: TravelRight[];
  validityStatus: ValidityStatus;
  validFrom: number;
  validTo: number;
  usedAccesses?: CarnetTravelRightUsedAccess[];
  maximumNumberOfAccesses?: number;
  numberOfUsedAccesses?: number;
};

export function getFareContractInfo(
  now: number,
  fc: FareContract,
  currentUserId?: string,
): FareContractInfoProps {
  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;

  const travelRights = fc.travelRights;
  const firstTravelRight = travelRights[0];

  const fareContractValidFrom = firstTravelRight.startDateTime.getTime();
  const fareContractValidTo = firstTravelRight.endDateTime.getTime();

  const validityStatus = getValidityStatus(now, fc, isSent);

  const carnetTravelRightAccesses = flattenTravelRightAccesses(travelRights);

  const lastUsedAccess =
    carnetTravelRightAccesses &&
    getLastUsedAccess(now, carnetTravelRightAccesses.usedAccesses);

  const validFrom = lastUsedAccess?.validFrom
    ? lastUsedAccess.validFrom
    : fareContractValidFrom;
  const validTo = lastUsedAccess?.validTo
    ? lastUsedAccess.validTo
    : fareContractValidTo;

  const usedAccesses = carnetTravelRightAccesses?.usedAccesses;
  const maximumNumberOfAccesses =
    carnetTravelRightAccesses?.maximumNumberOfAccesses;
  const numberOfUsedAccesses = carnetTravelRightAccesses?.numberOfUsedAccesses;

  return {
    travelRights,
    validityStatus,
    validFrom,
    validTo,
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  };
}

export const getReservationStatus = (reservation: Reservation) => {
  const paymentStatus = reservation.paymentStatus;
  switch (paymentStatus) {
    case 'CAPTURE':
      return 'approved';
    case 'REJECT':
      return 'rejected';
    default:
      return 'reserving';
  }
};

/**
 * These are following the rules from AtB-AS/kundevendt#4220, which apply for validityDuration of FareContracts
 * https://github.com/AtB-AS/kundevendt/issues/4220#issuecomment-2615206325
 * @param seconds
 */
export function fareContractValidityUnits(
  seconds: number,
): humanizeDuration.Unit[] {
  const oneMinuteInSeconds = 60;
  const oneHourInSeconds = oneMinuteInSeconds * 60;
  const oneDayInSeconds = oneHourInSeconds * 24;
  const sevenDaysInSeconds = oneDayInSeconds * 7;
  const unitMap: UnitMapType = [
    {range: {low: -Infinity, high: oneMinuteInSeconds - 1}, units: ['s']},
    {
      range: {low: oneMinuteInSeconds, high: oneHourInSeconds - 1},
      units: ['m', 's'],
    },
    {
      range: {low: oneHourInSeconds, high: oneDayInSeconds - 1},
      units: ['h', 'm'],
    },
    {
      range: {low: oneDayInSeconds, high: sevenDaysInSeconds - 1},
      units: ['d', 'h'],
    },
    {range: {low: sevenDaysInSeconds, high: Infinity}, units: ['d']},
  ];

  return (
    unitMap.find(({range}) => seconds >= range.low && seconds <= range.high)
      ?.units ?? ['d', 'h', 'm']
  );
}
