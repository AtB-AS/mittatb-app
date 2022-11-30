import {SituationType} from '@atb/situations/types';
import {
  getTextForLanguage,
  Language,
  SituationsTexts,
  TranslatedString,
  TranslateFunction,
} from '@atb/translations';
import {Error, Info, Warning} from '@atb/assets/svg/color/icons/status';
import {SvgProps} from 'react-native-svg';

export const getUniqueSituations = (situations: SituationType[] = []) => {
  let seenIds: string[] = [];
  let seenSituationNumbers: string[] = [];
  return situations.filter((s) => {
    if ('id' in s) {
      if (seenIds.includes(s.id)) return false;
      else seenIds.push(s.id);
    } else if (s.situationNumber) {
      if (seenSituationNumbers.includes(s.situationNumber)) return false;
      else seenSituationNumbers.push(s.situationNumber);
    }
    return true;
  });
};

/**
 * Get the situation summary, with a fallback to the description.
 */
export const getSituationSummary = (
  situation: SituationType,
  language: Language,
): string | undefined => {
  let text = getTextForLanguage(situation.summary, language);
  if (!text) {
    text = getTextForLanguage(situation.description, language);
  }
  return text || undefined;
};

export const getMessageTypeForSituation = (situation: SituationType) =>
  situation.reportType === 'incident' ? 'warning' : 'info';

export const getSvgForSituation = (
  situation: SituationType,
): ((p: SvgProps) => JSX.Element) => {
  const msgType = getMessageTypeForSituation(situation);
  switch (msgType) {
    case 'info':
      return Info;
    case 'warning':
      return Warning;
  }
};

export const getSvgForMostCriticalSituation = (
  situations: SituationType[],
  cancellation: boolean = false,
) => {
  if (cancellation) return Error;
  if (!situations.length) return undefined;
  return situations
    .map(getMessageTypeForSituation)
    .reduce((svg, msgType) => (msgType === 'warning' ? Warning : svg), Info);
};

export const getSituationA11yLabel = (
  situations: SituationType[],
  cancellation: boolean = false,
  t: TranslateFunction,
): string => {
  if (cancellation) return t(SituationsTexts.a11yLabel.error);
  if (!situations.length) return '';
  const messageType = situations
    .map(getMessageTypeForSituation)
    .reduce(
      (final, current) => (current === 'warning' ? 'warning' : final),
      'info',
    );
  return t(SituationsTexts.a11yLabel[messageType]);
};
