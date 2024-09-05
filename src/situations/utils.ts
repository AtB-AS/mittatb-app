import {SituationType} from './types';
import {
  getTextForLanguage,
  Language,
  SituationsTexts,
  TranslateFunction,
} from '@atb/translations';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {isAfter, isBefore, isBetween} from '@atb/utils/date';
import {statusComparator} from '@atb/utils/status-comparator';
import {Statuses} from '@atb/theme';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {Mode} from '@atb-as/theme';

export const getUniqueSituations = (situations: SituationType[] = []) => {
  const seenIds: string[] = [];
  const seenSituationNumbers: string[] = [];
  return situations.filter((s) => {
    const situationNumber = s.situationNumber;
    if ('id' in s) {
      if (seenIds.includes(s.id)) return false;
      else seenIds.push(s.id);
    } else if (situationNumber) {
      if (seenSituationNumbers.includes(situationNumber)) return false;
      else seenSituationNumbers.push(situationNumber);
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

export const getMessageTypeForSituation = (
  situation: SituationType,
): Extract<Statuses, 'warning' | 'info'> =>
  situation.reportType === 'incident' ? 'warning' : 'info';

export const getMsgTypeForMostCriticalSituationOrNotice = (
  situations: SituationType[],
  notices?: NoticeFragment[],
  cancellation: boolean = false,
): Exclude<Statuses, 'valid'> | undefined => {
  if (cancellation) return 'error';
  if (!situations.length) {
    return notices?.length ? 'info' : undefined;
  }
  return situations
    .map(getMessageTypeForSituation)
    .reduce<Exclude<Statuses, 'valid'> | undefined>(
      toMostCriticalStatus,
      undefined,
    );
};

/**
 * A function which may be used in a reducer function to decide what the most
 * critical status level is.
 */
export const toMostCriticalStatus = <T extends Statuses | undefined>(
  currentlyMostCritical: T,
  msgType: T,
): T => {
  if (!msgType) return currentlyMostCritical;
  if (!currentlyMostCritical) return msgType;
  return statusComparator(currentlyMostCritical, msgType) === 1
    ? currentlyMostCritical
    : msgType;
};

export const getSvgForMostCriticalSituationOrNotice = (
  situations: SituationType[],
  themeName: Mode,
  notices?: NoticeFragment[],
  cancellation: boolean = false,
) => {
  const msgType = getMsgTypeForMostCriticalSituationOrNotice(
    situations,
    notices,
    cancellation,
  );
  return msgType && messageTypeToIcon(msgType, true, themeName);
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
