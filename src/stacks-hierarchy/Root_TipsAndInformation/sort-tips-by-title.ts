import {TipType} from '@atb/stacks-hierarchy/Root_TipsAndInformation/types';
import {getTextForLanguage, Language} from '@atb/translations';

export function sortTipsByTitle(tips: TipType[], language: Language) {
  return tips.sort((a, b) => {
    const titleA = getTextForLanguage(a.title, language);
    const titleB = getTextForLanguage(b.title, language);
    if (!titleA || !titleB) return 0;
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
}
