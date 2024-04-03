import {
  CarnetTravelRight,
  CarnetTravelRightUsedAccess,
  FareContract,
  FareContractState,
  NormalTravelRight,
  flattenCarnetTravelRightAccesses,
  isCarnet,
  isCarnetTravelRight,
  isPreActivatedTravelRight,
  isSentOrReceivedFareContract,
} from '@atb/ticketing';
import {
  findReferenceDataById,
  getReferenceDataName,
  PreassignedFareProduct,
  TariffZone,
  useFirestoreConfiguration,
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

import {useMobileTokenContextState} from '@atb/mobile-token';
import {UsedAccessStatus} from './carnet/types';

export type RelativeValidityStatus = 'upcoming' | 'valid' | 'expired';

export type ValidityStatus =
  | RelativeValidityStatus
  | 'reserving'
  | 'unknown'
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
  const firstTravelRight = fc.travelRights.filter(
    isCarnet(fc) ? isCarnetTravelRight : isPreActivatedTravelRight,
  )[0];
  return getRelativeValidity(
    now,
    firstTravelRight.startDateTime.toMillis(),
    firstTravelRight.endDateTime.toMillis(),
  );
}

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
  const {mobileTokenStatus, tokens} = useMobileTokenContextState();
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
  const {mobileTokenStatus, tokens} = useMobileTokenContextState();
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
  const {fareProductTypeConfigs} = useFirestoreConfiguration();

  if (!fromTariffZone || !toTariffZone) return undefined;

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );
  const zoneSelectionModeDisabledForProduct =
    fareProductTypeConfig?.configuration.zoneSelectionMode === 'none';

  const usesZoneOfferEndpointForProduct =
    fareProductTypeConfig?.configuration.offerEndpoint === 'zones';

  if (zoneSelectionModeDisabledForProduct && !usesZoneOfferEndpointForProduct) return undefined;

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

export const getFareProductRef = (fc: FareContract) =>
  fc.travelRights[0]?.fareProductRef;

type FareContractInfoProps = {
  isCarnetFareContract: boolean;
  travelRights: NormalTravelRight[];
  fareContractValidityStatus: ValidityStatus;
  fareContractValidFrom: number;
  fareContractValidTo: number;
  carnetAccessStatus?: UsedAccessStatus;
  validityStatus: ValidityStatus;
  validFrom: number;
  validTo: number;
  maximumNumberOfAccesses?: number;
  numberOfUsedAccesses?: number;
};

export function getFareContractInfo(
  now: number,
  fc: FareContract,
  currentUserId?: string,
): FareContractInfoProps {
  const isCarnetFareContract = isCarnet(fc);

  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;

  const travelRights = fc.travelRights.filter(
    isCarnetFareContract ? isCarnetTravelRight : isPreActivatedTravelRight,
  );
  const firstTravelRight = travelRights[0];

  const fareContractValidFrom = firstTravelRight.startDateTime.toMillis();
  const fareContractValidTo = firstTravelRight.endDateTime.toMillis();

  const fareContractValidityStatus = getValidityStatus(now, fc, isSent);

  const carnetTravelRightAccesses = isCarnetFareContract
    ? flattenCarnetTravelRightAccesses(travelRights as CarnetTravelRight[])
    : undefined;

  const lastUsedAccess =
    carnetTravelRightAccesses &&
    getLastUsedAccess(now, carnetTravelRightAccesses.usedAccesses);

  const validFrom = lastUsedAccess?.validFrom
    ? lastUsedAccess.validFrom
    : fareContractValidFrom;
  const validTo = lastUsedAccess?.validTo
    ? lastUsedAccess.validTo
    : fareContractValidTo;

  const validityStatus = lastUsedAccess
    ? isSent
      ? 'sent'
      : lastUsedAccess.status
    : fareContractValidityStatus;
  // TODO: Carnet access status should be part of validity status
  const carnetAccessStatus = isSent ? 'inactive' : lastUsedAccess?.status;

  const maximumNumberOfAccesses =
    carnetTravelRightAccesses?.maximumNumberOfAccesses;
  const numberOfUsedAccesses = carnetTravelRightAccesses?.numberOfUsedAccesses;

  return {
    isCarnetFareContract,
    travelRights,
    fareContractValidityStatus,
    fareContractValidFrom,
    fareContractValidTo,
    carnetAccessStatus,
    validityStatus,
    validFrom,
    validTo,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  };
}

type LastUsedAccessState = {
  status: UsedAccessStatus;
  validFrom: number | undefined;
  validTo: number | undefined;
};

function getUsedAccessValidity(
  now: number,
  validFrom: number,
  validTo: number,
): UsedAccessStatus {
  if (now > validTo) return 'inactive';
  if (now < validFrom) return 'upcoming';
  return 'valid';
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
    validFrom = lastUsedAccess.startDateTime.toMillis();
    validTo = lastUsedAccess.endDateTime.toMillis();
    status = getUsedAccessValidity(now, validFrom, validTo);
  }

  return {status, validFrom, validTo};
}
