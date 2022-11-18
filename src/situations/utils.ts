import {SituationsType, SituationType} from '@atb/situations/types';
import {Language} from '@atb/translations';
import {getTextForLanguage} from '@atb/translations';

export const hasSituations = (situations: SituationsType) =>
  situations?.some((s) => s.description.length) ?? false;

export const getUniqueSituations = (
  situations: SituationsType = [],
  language: Language,
) => {
  let uniqueSituations: {[id: string]: string} = {};
  for (const situation of situations) {
    if (
      !situation.situationNumber ||
      uniqueSituations[situation.situationNumber]
    )
      continue;
    let value = getSituationText(situation, language);
    if (!value) continue;
    if (Object.values(uniqueSituations).includes(value)) continue;
    uniqueSituations[situation.situationNumber] = value;
  }
  return uniqueSituations;
};

export const getSituationText = (
  situation: SituationType,
  language: Language,
): string | undefined => {
  let text = getTextForLanguage(situation.description, language);
  if (!text && 'summary' in situation) {
    text = getTextForLanguage(situation.summary, language);
  }
  return text || undefined;
};
