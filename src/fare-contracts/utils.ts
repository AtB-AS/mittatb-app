import {FareContractState} from '@atb/ticketing';
import {UserProfile, TariffZone} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';
import {
  findReferenceDataById,
  getReferenceDataName,
} from '@atb/reference-data/utils';
import {RemoteToken} from '@atb/mobile-token/types';
import {
  FareContractTexts,
  Language,
  TranslateFunction,
  TariffZonesTexts,
} from '@atb/translations';
import {
  findInspectable,
  getDeviceName,
  isMobileToken,
  isTravelCardToken,
} from '@atb/mobile-token/utils';

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
  isError: boolean,
  fallbackEnabled: boolean,
  t: TranslateFunction,
  remoteTokens?: RemoteToken[],
  isInspectable?: boolean,
  fareProductType?: string,
) => {
  const inspectableToken = findInspectable(remoteTokens);
  if (isError && fallbackEnabled) return null;
  if (fareProductType !== 'carnet') {
    if (isError) return t(FareContractTexts.warning.unableToRetrieveToken);
    if (!inspectableToken)
      return t(FareContractTexts.warning.noInspectableTokenFound);
    if (isTravelCardToken(inspectableToken))
      return t(FareContractTexts.warning.travelCardAstoken);
    if (isMobileToken(inspectableToken) && !isInspectable)
      return t(
        FareContractTexts.warning.anotherMobileAsToken(
          getDeviceName(inspectableToken) ||
            t(FareContractTexts.warning.unnamedDevice),
        ),
      );
  } else {
    if (!isTravelCardToken(inspectableToken)) {
      return t(FareContractTexts.warning.carnetWarning);
    } else {
      return t(FareContractTexts.warning.travelCardAstoken);
    }
  }
};

export const getOtherDeviceIsInspectableWarning = (
  tokensEnabled: boolean,
  isError: boolean,
  fallbackEnabled: boolean,
  t: TranslateFunction,
  remoteTokens?: RemoteToken[],
  deviceIsInspectable?: boolean,
) => {
  const shouldShowWarning =
    tokensEnabled && (isError ? !fallbackEnabled : !deviceIsInspectable);
  if (!shouldShowWarning) return;

  const activeToken = findInspectable(remoteTokens);
  const deviceName =
    getDeviceName(activeToken) || t(FareContractTexts.warning.unnamedDevice);

  return isTravelCardToken(activeToken)
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
