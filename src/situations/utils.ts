import {SituationType} from './types';
import {
  getTextForLanguage,
  Language,
  SituationsTexts,
  TranslateFunction,
} from '@atb/translations';
import {Info, Warning} from '@atb/assets/svg/color/icons/status';
import {SvgProps} from 'react-native-svg';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {isAfter, isBefore, isBetween} from '@atb/utils/date';
import {Statuses} from '@atb-as/theme';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';

export const getUniqueSituations = (situations: SituationType[] = []) => {
  const seenIds: string[] = [];
  const seenSituationNumbers: string[] = [];
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

export const getMsgTypeForMostCriticalSituationOrNotice = (
  situations: SituationType[],
  notices?: NoticeFragment[],
  cancellation: boolean = false,
): Statuses | undefined => {
  if (cancellation) return 'error';
  if (!situations.length) {
    return notices?.length ? 'info' : undefined;
  }
  return situations
    .map(getMessageTypeForSituation)
    .reduce(
      (mostCritical, msgType) =>
        msgType === 'warning' ? 'warning' : mostCritical,
      'info',
    );
};

export const getSvgForMostCriticalSituationOrNotice = (
  situations: SituationType[],
  notices?: NoticeFragment[],
  cancellation: boolean = false,
) => {
  const msgType = getMsgTypeForMostCriticalSituationOrNotice(
    situations,
    notices,
    cancellation,
  );
  return msgType && messageTypeToIcon(msgType, true);
};

export const getSituationOrNoticeA11yLabel = (
  situations: SituationType[],
  notices: NoticeFragment[],
  cancellation: boolean = false,
  t: TranslateFunction,
): string | undefined => {
  if (cancellation) return t(SituationsTexts.a11yLabel.error);
  if (!situations.length) {
    return notices.length ? t(SituationsTexts.a11yLabel.info) : undefined;
  }
  const messageType = situations
    .map(getMessageTypeForSituation)
    .reduce(
      (final, current) => (current === 'warning' ? 'warning' : final),
      'info',
    );
  return t(SituationsTexts.a11yLabel[messageType]);
};

/**
 * Check if a situation is valid at a specific date by comparing it to the
 * validity period of the situation. If the situation has neither start time nor
 * end time it will be considered valid at all times.
 *
 * This function uses currying of the date to enable inline use in filter
 * functions.
 */
export const isSituationValidAtDate =
  (date: string | Date = new Date()) =>
  (situation: SituationType) => {
    const {startTime, endTime} = situation.validityPeriod || {};
    if (startTime && endTime) {
      return isBetween(date, startTime, endTime);
    } else if (startTime) {
      return isAfter(date, startTime);
    } else if (endTime) {
      return isBefore(date, endTime);
    }
    return true;
  };
