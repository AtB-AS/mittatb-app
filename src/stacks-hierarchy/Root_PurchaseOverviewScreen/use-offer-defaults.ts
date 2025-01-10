import {
  PreassignedFareProduct,
  useFirestoreConfigurationContext,
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
import {isValidTariffZone} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/FromToSelection';

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
  const {preassignedFareProducts} = useFirestoreConfigurationContext();

  const selection = useMemo(
    () => {
      const builder = selectionBuilder.forType(fareProductTypeConfig.type);

      if (preassignedFareProduct) builder.product(preassignedFareProduct);
      if (fromPlace && isValidTariffZone(fromPlace))
        builder.fromZone(fromPlace);
      if (toPlace && isValidTariffZone(toPlace)) builder.toZone(toPlace);
      if (fromPlace && !isValidTariffZone(fromPlace))
        builder.fromStopPlace(fromPlace);
      if (toPlace && !isValidTariffZone(toPlace)) builder.toStopPlace(toPlace);
      if (userProfilesWithCount) builder.userProfiles(userProfilesWithCount);
      if (travelDate) builder.date(travelDate);

      return builder.build();
    },
    /*
     We don't want to use the selection builder in hooks like useEffect or
     useMemo, it should be invoked by user actions. However, we temporarily d
     it here to be able to introduce it step by step.
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
