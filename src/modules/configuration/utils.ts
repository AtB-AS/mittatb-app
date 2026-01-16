import {
  PreassignedFareProduct,
  FareZone,
  UserProfile,
  SupplementProduct,
} from './types';
import {
  getTextForLanguage,
  Language,
  LanguageAndTextType,
} from '@atb/translations';

export type ReferenceDataNames = {
  name: LanguageAndTextType;
  alternativeNames?: LanguageAndTextType[];
};

/**
 * Wrapper for getting the name of a NeTeX entity in the given language.
 *
 * The name should always be present, however we fall back to "Unknown" so we
 * don't get any unexpected errors in the code. If we actually end up getting
 * "Unknown" somewhere in the app it should be fixed by updating the reference
 * data source.
 */
export const getReferenceDataName = <T extends ReferenceDataNames>(
  {name, alternativeNames}: T,
  language: Language,
): string =>
  getTextForLanguage([name, ...(alternativeNames || [])], language) ||
  'Unknown';

export const findReferenceDataById = <
  T extends UserProfile | PreassignedFareProduct | FareZone | SupplementProduct,
>(
  elements: T[],
  id: string,
) => elements.find((p) => p.id === id);
