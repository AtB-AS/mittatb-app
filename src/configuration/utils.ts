import {PreassignedFareProduct, TariffZone, UserProfile} from './types';
import {
  getTextForLanguage,
  Language,
  LanguageAndTextType,
} from '@atb/translations';
import {APP_VERSION} from '@env';
import {compareVersion} from '@atb/utils/compare-version';
import {CustomerProfile} from '@atb/ticketing';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';

/**
 * Wrapper for getting the name of a NeTeX entity in the given language.
 *
 * The name should always be present, however we fall back to "Unknown" so we
 * don't get any unexpected errors in the code. If we actually end up getting
 * "Unknown" somewhere in the app it should be fixed by updating the reference
 * data source.
 */
export const getReferenceDataName = <
  T extends {
    name: LanguageAndTextType;
    alternativeNames?: LanguageAndTextType[];
  },
>(
  {name, alternativeNames}: T,
  language: Language,
): string =>
  getTextForLanguage([name, ...(alternativeNames || [])], language) ||
  'Unknown';

export const findReferenceDataById = <
  T extends UserProfile | PreassignedFareProduct | TariffZone,
>(
  elements: T[],
  id: string,
) => elements.find((p) => p.id === id);

export function isOfFareProductRef(a: any): a is {fareProductRef: string} {
  return 'fareProductRef' in a;
}

export const isProductSellableInApp = (
  product: PreassignedFareProduct,
  customerProfile?: CustomerProfile,
) => {
  if (
    (product.limitations.appVersionMin &&
      compareVersion(product.limitations.appVersionMin, APP_VERSION) > 0) ||
    (product.limitations.appVersionMax &&
      compareVersion(product.limitations.appVersionMax, APP_VERSION) < 0)
  )
    return false;

  if (
    product.distributionChannel.some((channel) => channel === 'debug-app') &&
    customerProfile?.debug
  )
    return true;

  return product.distributionChannel.some((channel) => channel === 'app');
};

export const removeProductAliasDuplicates = (
  val: PreassignedFareProduct,
  i: number,
  arr: PreassignedFareProduct[],
): boolean => {
  if (val.productAliasId === undefined) return true;
  return onlyUniquesBasedOnField<PreassignedFareProduct>('productAliasId')(
    val,
    i,
    arr,
  );
};
