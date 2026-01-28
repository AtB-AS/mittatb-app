import type {FareContractType} from '@atb-as/utils';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {useHarbors} from '@atb/modules/harbors';
import {useMemo} from 'react';
import {
  useGetFareProductsQuery,
  useGetSupplementProductsQuery,
} from '@atb/modules/ticketing';
import {SupplementProduct} from '@atb-as/config-specs';

/**
 * Generates a purchase selection for purchasing a supplement product
 * for an existing fare contract, at a later point in time
 * @param existingFareContract The FareContract to build the purchase selection for
 */
export function useSupplementProductPurchaseSelection(
  existingFareContract: FareContractType,
): {
  selection?: PurchaseSelectionType;
} {
  const builder = usePurchaseSelectionBuilder();
  const {userProfiles} = useFirestoreConfigurationContext();
  const {data: harbors} = useHarbors();
  const {data: products} = useGetFareProductsQuery();
  const supplementProducts = useSupplementProducts();

  const selection = useMemo(() => {
    const travelRight = existingFareContract.travelRights[0];
    const product = findReferenceDataById(products, travelRight.fareProductRef);
    const supplementProductRef =
      product?.limitations.supplementProductRefs?.[0];
    const supplementProductFareProduct =
      supplementProductRef &&
      findReferenceDataById(products, supplementProductRef);
    const supplementProduct =
      supplementProductRef &&
      findReferenceDataById(supplementProducts, supplementProductRef);

    if (!supplementProduct || !supplementProductFareProduct) return;

    const userProfile =
      travelRight.userProfileRef &&
      findReferenceDataById(userProfiles, travelRight.userProfileRef);

    const fromHarbor = harbors.find((h) => h.id === travelRight.startPointRef);
    const toHarbor = harbors.find((h) => h.id === travelRight.endPointRef);

    return builder
      .forType(supplementProductFareProduct.type)
      .existingProduct(product)
      .supplementProducts([{...supplementProduct, count: 1}])
      .userProfiles(userProfile ? [{...userProfile, count: 1}] : [])
      .fromStopPlace(fromHarbor)
      .toStopPlace(toHarbor)
      .build();

    // We disable the exhaustive-deps rule here because we know builder is not
    // referentially stable. See documentation in usePurchaseSelectionBuilder.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingFareContract.travelRights, harbors, products, userProfiles]);

  return {
    selection,
  };
}

function useSupplementProducts() {
  const {data: supplementProducts} = useGetSupplementProductsQuery();
  return supplementProducts
    .map((sp) => SupplementProduct.safeParse(sp))
    .filter((sp) => sp.success)
    .filter((sp) => sp.success)
    .map((sp) => sp.data);
}
