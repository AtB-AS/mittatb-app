import {
  PreassignedFareProduct,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {useMemo} from 'react';
import {FareProductTypeConfig} from '@atb-as/config-specs';
import {
  PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/purchase-selection';

export function useOfferDefaults(
  preassignedFareProduct: PreassignedFareProduct | undefined,
  fareProductTypeConfig: FareProductTypeConfig,
  userProfilesWithCount?: UserProfileWithCount[],
  fromPlace?: TariffZoneWithMetadata | StopPlaceFragment,
  toPlace?: TariffZoneWithMetadata | StopPlaceFragment,
  travelDate?: string,
): {
  selection: PurchaseSelectionType;
  preassignedFareProductAlternatives: PreassignedFareProduct[];
} {
  const selectionBuilder = usePurchaseSelectionBuilder();
  const {preassignedFareProducts} = useFirestoreConfiguration();

  const selection = useMemo(
    () =>
      selectionBuilder
        .forType(fareProductTypeConfig.type)
        .product(preassignedFareProduct)
        .userProfiles(userProfilesWithCount)
        .from(fromPlace)
        .to(toPlace)
        .date(travelDate)
        .build(),
    /*
     Ok to temporary disable this warning . We don't want to use the selection
     builder in hooks like useEffect or useMemo, but it is temporarily done to
     be able to introduce it step by step.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      fareProductTypeConfig,
      preassignedFareProduct,
      userProfilesWithCount,
      fromPlace,
      toPlace,
      travelDate,
    ],
  );

  const preassignedFareProductAlternatives = useMemo(() => {
    const productAliasId = selection.preassignedFareProduct?.productAliasId;
    return productAliasId
      ? preassignedFareProducts.filter(
          (fp) => fp.productAliasId === productAliasId,
        )
      : [selection.preassignedFareProduct];
  }, [selection.preassignedFareProduct, preassignedFareProducts]);

  return {
    selection,
    preassignedFareProductAlternatives,
  };
}
