import {PreassignedFareProduct, FareZone, UserProfile} from './types';
import {
  getTextForLanguage,
  Language,
  LanguageAndTextType,
} from '@atb/translations';
import {APP_VERSION} from '@env';
import {compareVersion} from '@atb/utils/compare-version';
import {CustomerProfile} from '@atb/modules/ticketing';

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
  T extends UserProfile | PreassignedFareProduct | FareZone,
>(
  elements: T[],
  id: string,
) => elements.find((p) => p.id === id);

export function isOfFareProductRef(a: any): a is {fareProductRef: string} {
  return (
    a != null &&                            // checks a not null
    typeof a === 'object' &&                // checks if a is an object
    'fareProductRef' in a &&                // checks if `fareProductRef` is in a
    typeof a.fareProductRef === 'string'    // checks if `a.fareProductRef` is string
  );
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
