import {FareContractState} from '@atb/ticketing';
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

export type RelativeValidityStatus = 'upcoming' | 'valid' | 'expired';

export type ValidityStatus =
  | RelativeValidityStatus
  | 'reserving'
  | 'unknown'
  | 'refunded'
  | 'cancelled'
  | 'inactive'
  | 'rejected'
  | 'approved';

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
) =>
  `${u.count} ${getReferenceDataName(u, language)}`;

export function getValidityStatus(
  now: number,
  validFrom: number,
  validTo: number,
  state: FareContractState,
): ValidityStatus {
  if (state === FareContractState.Refunded) return 'refunded';
  if (state === FareContractState.Cancelled) return 'cancelled';
  return getRelativeValidity(now, validFrom, validTo);
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

export const useNonInspectableTokenWarning = (fareProductType?: string) => {
  const {t} = useTranslation();
  const {barcodeStatus, tokens} = useMobileTokenContextState();
  switch (barcodeStatus) {
    case 'mobiletoken':
    case 'static':
    case 'staticQr':
    case 'loading':
      return undefined;
    case 'error':
      return t(FareContractTexts.warning.errorWithToken);
    case 'other':
      const inspectableToken = tokens.find((t) => t.isInspectable);
      if (fareProductType === 'carnet') {
        if (inspectableToken?.type !== 'travel-card') {
          return t(FareContractTexts.warning.carnetWarning);
        } else {
          return t(FareContractTexts.warning.travelCardAstoken);
        }
      } else {
        return inspectableToken?.type === 'travel-card'
          ? t(FareContractTexts.warning.travelCardAstoken)
          : t(
              FareContractTexts.warning.anotherMobileAsToken(
                inspectableToken?.name ||
                  t(FareContractTexts.warning.unnamedDevice),
              ),
            );
      }
  }
};

export const useOtherDeviceIsInspectableWarning = () => {
  const {t} = useTranslation();
  const {barcodeStatus, tokens} = useMobileTokenContextState();
  switch (barcodeStatus) {
    case 'mobiletoken':
    case 'static':
    case 'staticQr':
    case 'loading':
      return undefined;
    case 'error':
      return t(FareContractTexts.warning.errorWithToken);
    case 'other':
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
