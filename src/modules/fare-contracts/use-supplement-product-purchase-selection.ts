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
import {isBefore, startOfDay} from 'date-fns';

type Props = {
  existingFareContract: FareContractType;
  isEnabled: boolean;
};

/**
 * Generates a purchase selection for purchasing a supplement product
 * for an existing fare contract, at a later point in time
 * @param existingFareContract The FareContract to build the purchase selection for
 * @param isEnabled Whether supplement product purchase selection is enabled
 */
export function useSupplementProductPurchaseSelection({
  existingFareContract,
  isEnabled,
}: Props): {
  selection?: PurchaseSelectionType;
} {
  const builder = usePurchaseSelectionBuilder();
  const {userProfiles} = useFirestoreConfigurationContext();
  const {data: harbors} = useHarbors();
  const {data: products} = useGetFareProductsQuery();
  const supplementProducts = useSupplementProducts();

  const selection = useMemo(() => {
    if (!isEnabled) return;
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

    return (
      builder
        .forType(supplementProductFareProduct.type)
        /*
         * This is necessary because we might have several supplement products,
         * so getDefaultProduct in .forType can default to another.
         */
        .product(supplementProductFareProduct)
        .originFareContract({
          id: existingFareContract.id,
          product,
          startDate: travelRight.startDateTime.toISOString(),
          endDate: travelRight.endDateTime.toISOString(),
        })
        /*
         * If the travel right has not yet started, we set the search time to the start
         * date of the travel right since reservations can't be made before that time.
         * The user can choose to navigate back in time in the UI to explore departures.
         * If the travel right has already started, we default to now.
         */
        .date(
          isBefore(new Date(), travelRight.startDateTime)
            ? startOfDay(travelRight.startDateTime).toISOString()
            : undefined,
        )
        .supplementProducts([{...supplementProduct, count: 1}])
        .userProfiles(userProfile ? [{...userProfile, count: 1}] : [])
        .fromStopPlace(fromHarbor)
        .toStopPlace(toHarbor)
        .build()
    );

    // We disable the exhaustive-deps rule here because we know builder is not
    // referentially stable. See documentation in usePurchaseSelectionBuilder.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    existingFareContract.travelRights,
    harbors,
    products,
    userProfiles,
    isEnabled,
  ]);

  return {
    selection,
  };
}

function useSupplementProducts() {
  const {data: supplementProducts} = useGetSupplementProductsQuery();
  return supplementProducts
    .map((sp) => SupplementProduct.safeParse(sp))
    .filter((sp) => sp.success)
    .map((sp) => sp.data);
}
