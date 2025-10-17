import {
  getLastUsedAccess,
  isSentOrReceivedFareContract,
  Reservation,
} from '@atb/modules/ticketing';
import {
  FareContractState,
  FareContractType,
  getAccesses,
  type UsedAccessType,
} from '@atb-as/utils';
import {
  FareZone,
  findReferenceDataById,
  getReferenceDataName,
  PreassignedFareProduct,
  useFirestoreConfigurationContext,
  UserProfile,
} from '@atb/modules/configuration';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {
  FareContractTexts,
  FareZonesTexts,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {useAuthContext} from '@atb/modules/auth';
import {useCallback, useMemo} from 'react';

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
  fc: FareContractType,
  isSentFareContract?: boolean,
): ValidityStatus {
  if (fc.state === FareContractState.Refunded) return 'refunded';
  if (fc.state === FareContractState.Cancelled) return 'cancelled';
  if (isSentFareContract) return 'sent';

  const fareContractAccesses = getAccesses(fc);
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

export const hasShmoBookingId = (fc?: FareContractType) => !!fc?.bookingId;

export const useSortFcOrReservationByValidityAndCreation = (
  now: number,
  fcOrReservations: (Reservation | FareContractType)[],
  getFareContractStatus: (
    now: number,
    fc: FareContractType,
    currentUserId?: string,
  ) => ValidityStatus | undefined,
): (FareContractType | Reservation)[] => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const getFcOrReservationOrder = useCallback(
    (fcOrReservation: FareContractType | Reservation) => {
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
    .reduce(
      (groupedById, userProfileRef) => {
        const existing = groupedById.find(
          (r) => r.userProfileRef === userProfileRef,
        );
        if (existing) {
          existing.count += 1;
          return groupedById;
        }
        return [...groupedById, {userProfileRef, count: 1}];
      },
      [] as {userProfileRef: string; count: number}[],
    )
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

export const useFareZoneSummary = (
  preassignedFareProduct?: PreassignedFareProduct,
  fromFareZone?: FareZone,
  toFareZone?: FareZone,
) => {
  const {t, language} = useTranslation();
  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();

  if (!fromFareZone || !toFareZone) return undefined;

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );
  const zoneSelectionModeDisabledForProduct =
    fareProductTypeConfig?.configuration.zoneSelectionMode === 'none';
  if (zoneSelectionModeDisabledForProduct) return undefined;

  return fareZonesSummary(fromFareZone, toFareZone, language, t);
};

export const isValidFareContract = (status: ValidityStatus) =>
  status === 'valid';

export function fareZonesSummary(
  fromFareZone: FareZone,
  toFareZone: FareZone,
  language: Language,
  t: TranslateFunction,
): string {
  if (fromFareZone.id === toFareZone.id) {
    return t(
      FareZonesTexts.zoneSummary.text.singleZone(
        getReferenceDataName(fromFareZone, language),
      ),
    );
  } else {
    return t(
      FareZonesTexts.zoneSummary.text.multipleZone(
        getReferenceDataName(fromFareZone, language),
        getReferenceDataName(toFareZone, language),
      ),
    );
  }
}

type FareContractInfoProps = {
  validityStatus: ValidityStatus;
  validFrom: number;
  validTo: number;
  usedAccesses?: UsedAccessType[];
};

export function getFareContractInfo(
  now: number,
  fc: FareContractType,
  currentUserId?: string,
): FareContractInfoProps {
  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;

  const travelRights = fc.travelRights;
  const firstTravelRight = travelRights[0];

  const fareContractValidFrom = firstTravelRight.startDateTime.getTime();
  const fareContractValidTo = firstTravelRight.endDateTime.getTime();

  const validityStatus = getValidityStatus(now, fc, isSent);

  const carnetTravelRightAccesses = getAccesses(fc);

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

  return {
    validityStatus,
    validFrom,
    validTo,
    usedAccesses,
  };
}

/**
 * Map reservation paymentStatus to a more "intuitive" status. Note that
 * - CREDIT and CANCEL are filtered out in the Ticketing Context
 * - AUTHENTICATE, CREATE, IMPORT and INITIATE are all considered "reserving"
 */
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
