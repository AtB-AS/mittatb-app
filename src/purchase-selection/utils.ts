import {PreassignedFareProduct} from '@atb/configuration/types';
import {compareVersion} from '@atb/utils/compare-version';
import type {
  PurchaseSelectionBuilderInput,
  PurchaseSelectionType,
} from './types';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {TariffZone, UserProfile} from '@atb-as/config-specs';
import {isValidDateString} from '@atb/utils/date';

export const isProductSellableInApp = (
  input: PurchaseSelectionBuilderInput,
  product: PreassignedFareProduct,
) => {
  if (
    (product.limitations.appVersionMin &&
      compareVersion(product.limitations.appVersionMin, input.appVersion) >
        0) ||
    (product.limitations.appVersionMax &&
      compareVersion(product.limitations.appVersionMax, input.appVersion) < 0)
  )
    return false;

  if (
    product.distributionChannel.some((channel) => channel === 'debug-app') &&
    input.customerProfile?.debug
  )
    return true;

  return product.distributionChannel.some((channel) => channel === 'app');
};

export const getDefaultProduct = (
  input: PurchaseSelectionBuilderInput,
  configType: string,
) =>
  input.preassignedFareProducts
    .filter((product) => isProductSellableInApp(input, product))
    .filter((product) => product.type === configType)
    .reduce((selected, current) => (current.isDefault ? current : selected));

export const getDefaultZone = (
  input: PurchaseSelectionBuilderInput,
  product: PreassignedFareProduct,
): TariffZoneWithMetadata => {
  const selectableZones = input.tariffZones.filter((zone) =>
    isSelectableZone(product, zone),
  );

  if (input.currentCoordinates) {
    const {longitude, latitude} = input.currentCoordinates;
    const zoneFromLocation = selectableZones.find((t) =>
      turfBooleanPointInPolygon([longitude, latitude], t.geometry),
    );
    if (zoneFromLocation) {
      return {...zoneFromLocation, resultType: 'geolocation'};
    }
  }

  const zone = selectableZones.reduce((selected, current) =>
    current.isDefault ? current : selected,
  );
  return {...zone, resultType: 'zone'};
};

export const getDefaultUserProfiles = (
  input: PurchaseSelectionBuilderInput,
  product: PreassignedFareProduct,
): UserProfileWithCount[] => {
  const selectableProfiles = getSelectableUserProfiles(
    input.userProfiles,
    product,
  );
  const profile = selectableProfiles.reduce((selected, current) =>
    current.userTypeString === input.defaultUserTypeString ? current : selected,
  );
  return [{...profile, count: 1}];
};

export const getSelectableUserProfiles = (
  userProfiles: UserProfile[],
  product: PreassignedFareProduct,
): UserProfile[] =>
  userProfiles.filter((profile) => isSelectableProfile(product, profile));

export const isSelectableProduct = (
  input: PurchaseSelectionBuilderInput,
  currentSelection: PurchaseSelectionType,
  product: PreassignedFareProduct,
) => {
  if (currentSelection.fareProductTypeConfig.type !== product.type) {
    return false;
  }
  return isProductSellableInApp(input, product);
};

export const isSelectableProfile = (
  product: PreassignedFareProduct,
  profile: UserProfile,
) => {
  const profileLimitations = product.limitations.userProfileRefs;
  const emptyLimitations = !profileLimitations.length;
  return (
    emptyLimitations ||
    profileLimitations.some(
      (allowedProfileId) => profile.id === allowedProfileId,
    )
  );
};

export const isSelectableZone = (
  product: PreassignedFareProduct,
  zone: TariffZone,
) => {
  const zoneLimitations = product.limitations.tariffZoneRefs;
  const emptyLimitations = !zoneLimitations?.length;
  return (
    emptyLimitations ||
    zoneLimitations.some((allowedZoneId) => zone.id === allowedZoneId)
  );
};

export const isValidSelection = (
  input: PurchaseSelectionBuilderInput,
  selection: PurchaseSelectionType,
) => {
  const isProductValid = isSelectableProduct(
    input,
    selection,
    selection.preassignedFareProduct,
  );
  if (!isProductValid) return false;

  const areProfilesValid = selection.userProfilesWithCount.every((p) =>
    isSelectableProfile(selection.preassignedFareProduct, p),
  );
  if (!areProfilesValid) return false;

  const isFromZoneValid =
    'geometry' in selection.fromPlace
      ? isSelectableZone(selection.preassignedFareProduct, selection.fromPlace)
      : true;
  if (!isFromZoneValid) return false;

  const isToZoneValid =
    'geometry' in selection.toPlace
      ? isSelectableZone(selection.preassignedFareProduct, selection.toPlace)
      : true;
  if (!isToZoneValid) return false;

  const isDateValid = selection.travelDate
    ? isValidDateString(selection.travelDate)
    : true;
  if (!isDateValid) return false;

  return true;
};

/**
 * Apply product change on a purcase selection, returning a new selection with
 * the new product applied, and also the existing user profiles and zones
 * selection are validated in regard to limitations on the new product. If the
 * current profiles/zones are not applicable, then defaults are applied.
 */
export const applyProductChange = (
  input: PurchaseSelectionBuilderInput,
  currentSelection: PurchaseSelectionType,
  product: PreassignedFareProduct,
): PurchaseSelectionType => {
  const selectableProfiles = currentSelection.userProfilesWithCount.filter(
    (up) => isSelectableProfile(product, up),
  );

  const isFromZoneValid =
    'geometry' in currentSelection.fromPlace &&
    isSelectableZone(product, currentSelection.fromPlace);

  const isToZoneValid =
    'geometry' in currentSelection.toPlace &&
    isSelectableZone(product, currentSelection.toPlace);

  const bothZonesValid = isFromZoneValid && isToZoneValid;
  const newZone = bothZonesValid ? undefined : getDefaultZone(input, product);

  return {
    ...currentSelection,
    preassignedFareProduct: product,
    userProfilesWithCount: selectableProfiles.length
      ? selectableProfiles
      : getDefaultUserProfiles(input, product),
    fromPlace: newZone ?? currentSelection.fromPlace,
    toPlace: newZone ?? currentSelection.toPlace,
  };
};
