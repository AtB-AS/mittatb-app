import {FareContractState} from '@atb/ticketing';
import {
  findReferenceDataById,
  getReferenceDataName,
  TariffZone,
  UserProfile,
} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {
  FareContractTexts,
  Language,
  TariffZonesTexts,
  TranslateFunction,
} from '@atb/translations';

import {DeviceInspectionStatus, Token} from '@atb/mobile-token';

export type RelativeValidityStatus = 'upcoming' | 'valid' | 'expired';

export type ValidityStatus =
  | RelativeValidityStatus
  | 'reserving'
  | 'unknown'
  | 'refunded'
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
  omitUserProfileCount: Boolean | undefined,
  language: Language,
) =>
  omitUserProfileCount
    ? `${getReferenceDataName(u, language)}`
    : `${u.count} ${getReferenceDataName(u, language)}`;

export function getValidityStatus(
  now: number,
  validFrom: number,
  validTo: number,
  state: FareContractState,
): ValidityStatus {
  if (state === FareContractState.Refunded) return 'refunded';
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

export const getNonInspectableTokenWarning = (
  deviceInspectionStatus: DeviceInspectionStatus,
  t: TranslateFunction,
  tokens: Token[],
  fareProductType?: string,
) => {
  if (deviceInspectionStatus === 'inspectable') return null;
  const inspectableToken = tokens.find((t) => t.isInspectable);
  if (fareProductType !== 'carnet') {
    if (!inspectableToken) return t(FareContractTexts.warning.errorWithToken);
    if (inspectableToken.type === 'travel-card')
      return t(FareContractTexts.warning.travelCardAstoken);
    if (inspectableToken.type === 'mobile')
      return t(
        FareContractTexts.warning.anotherMobileAsToken(
          inspectableToken.name || t(FareContractTexts.warning.unnamedDevice),
        ),
      );
  } else {
    if (inspectableToken?.type !== 'travel-card') {
      return t(FareContractTexts.warning.carnetWarning);
    } else {
      return t(FareContractTexts.warning.travelCardAstoken);
    }
  }
};

export const getOtherDeviceIsInspectableWarning = (
  deviceInspectionStatus: DeviceInspectionStatus,
  t: TranslateFunction,
  tokens: Token[],
) => {
  const shouldShowWarning = deviceInspectionStatus !== 'inspectable';
  if (!shouldShowWarning) return;

  const inspectableToken = tokens.find((t) => t.isInspectable);
  const deviceName =
    inspectableToken?.name || t(FareContractTexts.warning.unnamedDevice);

  return inspectableToken?.type === 'travel-card'
    ? t(FareContractTexts.warning.tcardIsInspectableWarning)
    : t(FareContractTexts.warning.anotherPhoneIsInspectableWarning(deviceName));
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
