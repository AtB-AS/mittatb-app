import {useGetSupplementProductsQuery} from '@atb/modules/ticketing';
import {
  PreassignedFareProduct,
  SupplementProduct,
} from '@atb/modules/configuration';
import {findReferenceDataById} from '@atb/modules/configuration';
import {isDefined} from '@atb/utils/presence';

export const useBaggageProducts = (
  productsInFareContract: PreassignedFareProduct[],
): SupplementProduct[] => {
  const {data: allSupplementProducts} = useGetSupplementProductsQuery();
  return getBaggageProducts(productsInFareContract, allSupplementProducts);
};

export const getBaggageProducts = (
  productsInFareContract: PreassignedFareProduct[],
  allSupplementProducts: SupplementProduct[],
): SupplementProduct[] => {
  const supplementFareProducts = productsInFareContract.filter(
    (p) => p.isSupplementProduct,
  );

  const supplementProducts = supplementFareProducts
    .map((p) => findReferenceDataById(allSupplementProducts, p.id))
    .filter(isDefined);

  return supplementProducts.filter((p) => p.isBaggageProduct);
};
