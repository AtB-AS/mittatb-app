import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {mapToLanguageAndTexts} from '@atb/utils/map-to-language-and-texts';
import {TipRaw, TipType} from '@atb/tips-and-information/types';

export function mapToTips(
  result: FirebaseFirestoreTypes.QueryDocumentSnapshot<TipRaw>[],
): TipType[] {
  if (!result) return [];

  return result
    .map((gm) => mapToTip(gm.id, gm.data()))
    .filter((gm): gm is TipType => !!gm);
}

function mapToTip(id: string, result: TipRaw): TipType | undefined {
  if (!result) return;

  const title = mapToLanguageAndTexts(result.title);
  const description = mapToLanguageAndTexts(result.description);
  const emoji = result.emoji;

  if (!title || !description || !emoji) return;

  return {
    id,
    title,
    description,
    emoji,
  };
}
