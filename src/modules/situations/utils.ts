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
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {Mode} from '@atb-as/theme';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import type {Leg} from '@atb/api/types/trips';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {getTranslatedModeName} from '@atb/utils/transportation-names';

export function findAllNoticesFromLeg(leg: Leg): NoticeFragment[] {
  const notices: NoticeFragment[] = [];
  if (leg.fromEstimatedCall?.notices) {
    notices.push(...leg.fromEstimatedCall.notices);
  }
  if (leg.toEstimatedCall?.notices) {
    notices.push(...leg.toEstimatedCall.notices);
  }
  return notices.filter((n) => !!n.id && (n.text?.length ?? 0) > 0);
}

export function findAllNotices(tp: TripPatternFragment): NoticeFragment[] {
  return tp.legs
    .map(findAllNoticesFromLeg)
    .flat()
    .filter(onlyUniquesBasedOnField('id'));
}

/**
 * Get all relevant situations for a leg. All sources (`leg.situations`,
 * `fromEstimatedCall.situations`, `toEstimatedCall.situations`) are
 * pre-filtered by Entur Journey Planner to only include situations valid
 * for that specific leg's time and stops, so no additional validity
 * filtering is needed.
 *
 * Note: `leg.fromPlace.quay?.situations` and `leg.toPlace.quay?.situations`
 * are not used here as they are quay-level situations not scoped to
 * this leg's time window.
 */
export function findAllSituationsFromLeg(leg: Leg): SituationFragment[] {
  return [
    leg.situations,
    leg.fromEstimatedCall?.situations ?? [],
    leg.toEstimatedCall?.situations ?? [],
  ].flat();
}

/**
 * Get all unique situations across all legs of a trip pattern.
 * Since `findAllSituationsFromLeg` returns only situations pre-filtered by
 * Entur Journey Planner, no additional validity filtering is needed here.
 */
export function findAllSituations(
  tp: TripPatternFragment,
): SituationFragment[] {
  return tp.legs
    .map(findAllSituationsFromLeg)
    .flat()
    .filter(onlyUniquesBasedOnField('id'));
}

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
    .reduce<
      Exclude<Statuses, 'valid'> | undefined
    >(toMostCriticalStatus, undefined);
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
  return msgType && statusTypeToIcon(msgType, true, themeName);
};

/**
 * Get the most critical message type for a leg, considering situations, notices,
 * special transport submodes like RailReplacementBus, and booking requirements.
 */
export const getMsgTypeForLeg = (
  leg: Leg,
): Exclude<Statuses, 'valid'> | undefined => {
  const situations = findAllSituationsFromLeg(leg);
  const notices = findAllNoticesFromLeg(leg);
  const msgType = getMsgTypeForMostCriticalSituationOrNotice(
    situations,
    notices,
  );
  const railReplacementBusMsgType: Exclude<Statuses, 'valid'> | undefined =
    leg.transportSubmode === TransportSubmode.RailReplacementBus
      ? 'warning'
      : undefined;
  const bookingMsgType: Exclude<Statuses, 'valid'> | undefined =
    leg.bookingArrangements ? 'warning' : undefined;
  return [msgType, railReplacementBusMsgType, bookingMsgType].reduce(
    toMostCriticalStatus,
    undefined,
  );
};

/**
 * Get the most critical notification SVG across multiple legs.
 */
export const getNotificationSvgForLegs = (legs: Leg[], themeName: Mode) => {
  const msgType = legs
    .map(getMsgTypeForLeg)
    .reduce<
      Exclude<Statuses, 'valid'> | undefined
    >(toMostCriticalStatus, undefined);
  return msgType && statusTypeToIcon(msgType, true, themeName);
};

/**
 * Get an accessibility label describing situations, notices, or special
 * transport submodes (e.g. RailReplacementBus) for a single leg.
 * Returns undefined if there is nothing to announce.
 */
export const getA11yLabelForLeg = (
  leg: Leg,
  t: TranslateFunction,
): string | undefined => {
  const msgType = getMsgTypeForLeg(leg);
  return msgType ? t(SituationsTexts.a11yLabel[msgType]) : undefined;
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
 * Get a generic legs accessibility label summarizing situations, notices,
 * rail replacement bus and booking across all legs. Classifies into warnings vs notices
 * and returns a short summary like "Reisen har advarsler" with an action prompt.
 * Returns undefined if there is nothing to announce.
 */
export const getLegsNotificationA11yLabel = (
  legs: Leg[],
  t: TranslateFunction,
): string | undefined => {
  let hasWarnings = false;
  let hasNotices = false;

  for (const leg of legs) {
    if (leg.transportSubmode === TransportSubmode.RailReplacementBus) {
      hasWarnings = true;
    }

    if (leg.bookingArrangements) {
      hasWarnings = true;
    }

    for (const situation of findAllSituationsFromLeg(leg)) {
      if (getMessageTypeForSituation(situation) === 'warning') {
        hasWarnings = true;
      } else {
        hasNotices = true;
      }
    }

    const notices = findAllNoticesFromLeg(leg);
    if (notices.length > 0) {
      hasNotices = true;
    }

    if (hasWarnings && hasNotices) break;
  }

  if (!hasWarnings && !hasNotices) return undefined;

  const summaryText =
    hasWarnings && hasNotices
      ? t(SituationsTexts.tripSummary.warningsAndNotices)
      : hasWarnings
        ? t(SituationsTexts.tripSummary.warnings)
        : t(SituationsTexts.tripSummary.notices);

  return `${summaryText}. ${t(SituationsTexts.tripSummary.openDetailsForMoreInfo)}`;
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

/**
 * Build a detailed accessibility label that reads out each transit leg's
 * situations and notices with the originating line.
 *
 * Example output: "Bus 1: Bus stop has moved. Bus 11: Does not stop at Prinsens Gate."
 *
 * Returns undefined when there is nothing to announce.
 */
export const getDetailedSituationOrNoticeA11yLabel = (
  tripPattern: TripPatternFragment,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  const fragments: string[] = [];

  for (const leg of tripPattern.legs) {
    if (leg.mode === 'foot') continue;

    const situations = findAllSituationsFromLeg(leg);
    const notices = findAllNoticesFromLeg(leg);

    if (situations.length === 0 && notices.length === 0) continue;

    const modeName = t(
      getTranslatedModeName(leg.mode, leg.line?.transportSubmode),
    );
    const publicCode = leg.line?.publicCode ?? '';
    const legPrefix = `${modeName} ${publicCode}`.trim();

    const texts: string[] = [];

    for (const situation of situations) {
      const text = getTextForLanguage(situation.description, language);
      if (text) texts.push(text);
    }

    for (const notice of notices) {
      if (notice.text) texts.push(notice.text);
    }

    if (texts.length > 0) {
      fragments.push(`${legPrefix}: ${texts.join(', ')}`);
    }
  }

  return fragments.length > 0
    ? `. ${t(SituationsTexts.tripSummary.detailedPrefix)}. ${fragments.join('. ')}`
    : undefined;
};
