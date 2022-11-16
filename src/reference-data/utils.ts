import {PreassignedFareProduct, TariffZone, UserProfile} from './types';
import {
  getTextForLanguage,
  LanguageAndTextType,
  Language,
} from '@atb/translations';

/**
 * Wrapper for getting the name of a NeTeX entity in the given language.
 *
 * The name should always be present, however we fall back to "Unknown" so we
 * don't get any unexpected errors if the code. If we actually end up getting
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

export const productIsSellableInApp = (product: PreassignedFareProduct) => {
  return product.distributionChannel.some((channel) => channel === 'app');
};
