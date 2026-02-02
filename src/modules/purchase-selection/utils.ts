import {PreassignedFareProduct} from '@atb/modules/configuration';
import type {
  PurchaseSelectionBuilderInput,
  PurchaseSelectionType,
} from './types';
import {FareZoneWithMetadata} from '@atb/fare-zones-selector';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {
  type FareProductTypeConfig,
  FareZone,
  type SupplementProduct,
  UserProfile,
} from '@atb-as/config-specs';
import {isValidDateString} from '@atb/utils/date';
import {decodePolylineEncodedGeometry} from '@atb/utils/decode-polyline-geometry';
import {isProductSellableInApp} from '@atb/utils/is-product-sellable-in-app';

/**
 * This implementation assumes that input.preassignedFareProducts always has at least one
 * produdct for the given configType
 */
export const getDefaultProduct = (
  input: PurchaseSelectionBuilderInput,
  configType: string,
) =>
  input.preassignedFareProducts
    .filter((product) =>
      isProductSellableInApp(product, input.customerProfile, input.appVersion),
    )
    .filter((product) => product.type === configType)
    .reduce((selected, current) => (current.isDefault ? current : selected));

/**
 * This implementation assumes that input.fareZones always has at least one
 * selectable zone for the given product
 */
export const getDefaultZones = (
  input: PurchaseSelectionBuilderInput,
  typeConfig: FareProductTypeConfig,
  product: PreassignedFareProduct,
): PurchaseSelectionType['zones'] | undefined => {
  if (getPlaceSelectionMode(typeConfig) !== 'zones') return undefined;

  const selectableZones = input.fareZones.filter((zone) =>
    isSelectableZone(product, zone),
  );

  let zoneWithMetadata: FareZoneWithMetadata | undefined = undefined;
  if (input.currentCoordinates) {
    const {longitude, latitude} = input.currentCoordinates;
    const zoneFromLocation = selectableZones.find((t) =>
      turfBooleanPointInPolygon(
        [longitude, latitude],
        decodePolylineEncodedGeometry(t.geometry),
      ),
    );
    if (zoneFromLocation) {
      zoneWithMetadata = {...zoneFromLocation, resultType: 'geolocation'};
    }
  }

  if (!zoneWithMetadata) {
    const zone = selectableZones.reduce((selected, current) =>
      current.isDefault ? current : selected,
    );
    zoneWithMetadata = {...zone, resultType: 'zone'};
  }

  return {from: zoneWithMetadata, to: zoneWithMetadata};
};

export const getDefaultStopPlaces = (
  typeConfig: FareProductTypeConfig,
): PurchaseSelectionType['stopPlaces'] | undefined => {
  if (getPlaceSelectionMode(typeConfig) !== 'stop-places') return undefined;
  return {from: undefined, to: undefined};
};

/**
 * This implementation assumes that input.userProfiles always has at least one
 * selectable zone for the given product
 */
export const getDefaultUserProfiles = (
  input: PurchaseSelectionBuilderInput,
  product: PreassignedFareProduct,
): UserProfileWithCount[] => {
  const profile = input.userProfiles
    .filter((profile) => isSelectableProfile(product, profile))
    .reduce((selected, current) =>
      current.userTypeString === input.defaultUserTypeString
        ? current
        : selected,
    );
  return [{...profile, count: 1}];
};

export const isSelectableProduct = (
  input: PurchaseSelectionBuilderInput,
  currentSelection: PurchaseSelectionType,
  product: PreassignedFareProduct,
) => {
  if (currentSelection.fareProductTypeConfig.type !== product.type) {
    return false;
  }
  return isProductSellableInApp(
    product,
    input.customerProfile,
    input.appVersion,
  );
};

export const isSelectableProfile = (
  product: PreassignedFareProduct,
  profile: UserProfile,
) => {
  return !!product.limitations.userProfileRefs?.some(
    (allowedProfileId) => profile.id === allowedProfileId,
  );
};

export const isSelectableSupplementProduct = (
  currentSelection: PurchaseSelectionType,
  supplementProduct: SupplementProduct,
) => {
  return !!currentSelection.preassignedFareProduct.limitations.supplementProductRefs?.some(
    (allowedSupplementProductId) =>
      supplementProduct.id === allowedSupplementProductId,
  );
};

export const isSelectableZone = (
  product: PreassignedFareProduct,
  zone: FareZone,
) => {
  const zoneLimitations = product.limitations.fareZoneRefs;
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

  const areSupplementProductsValid =
    selection.supplementProductsWithCount.every((sp) =>
      isSelectableSupplementProduct(selection, sp),
    );
  if (!areSupplementProductsValid) return false;

  const isFromZoneValid = selection.zones
    ? isSelectableZone(selection.preassignedFareProduct, selection.zones.from)
    : true;
  if (!isFromZoneValid) return false;

  const isToZoneValid = selection.zones
    ? isSelectableZone(selection.preassignedFareProduct, selection.zones.to)
    : true;
  if (!isToZoneValid) return false;

  const isDateValid = selection.travelDate
    ? isValidDateString(selection.travelDate)
    : true;
  if (!isDateValid) return false;

  return true;
};

export const getPlaceSelectionMode = (
  typeConfig: FareProductTypeConfig,
): 'zones' | 'stop-places' | 'none' => {
  switch (typeConfig.configuration.zoneSelectionMode) {
    case 'multiple':
    case 'multiple-zone':
    case 'multiple-stop':
    case 'single':
    case 'single-zone':
    case 'single-stop':
      return 'zones';
    case 'multiple-stop-harbor':
      return 'stop-places';
    case 'none':
      return 'none';
  }
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
  const userCount = currentSelection.userProfilesWithCount.filter((up) =>
    isSelectableProfile(product, up),
  );
  const supplementProductCount =
    currentSelection.supplementProductsWithCount.filter((sp) =>
      isSelectableSupplementProduct(currentSelection, sp),
    );

  const isFromZoneValid =
    !currentSelection.zones ||
    isSelectableZone(product, currentSelection.zones.from);

  const isToZoneValid =
    !currentSelection.zones ||
    isSelectableZone(product, currentSelection.zones.to);

  const bothZonesValid = isFromZoneValid && isToZoneValid;
  const newZones = bothZonesValid
    ? undefined
    : getDefaultZones(input, currentSelection.fareProductTypeConfig, product);

  const userProfiles =
    !userCount.length && !supplementProductCount.length
      ? getDefaultUserProfiles(input, product)
      : userCount;

  return {
    ...currentSelection,
    preassignedFareProduct: product,
    userProfilesWithCount: userProfiles,
    zones: newZones ?? currentSelection.zones,
  };
};
