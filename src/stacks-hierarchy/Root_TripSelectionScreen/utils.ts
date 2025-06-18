import type {TripPatternWithBooking} from '@atb/api/types/trips';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {isSituationValidAtDate} from '@atb/modules/situations';

export function findAllNotices(tp: TripPatternWithBooking): NoticeFragment[] {
  const notices: NoticeFragment[] = [];
  tp.legs.forEach((leg) => {
    if (leg.fromEstimatedCall?.notices) {
      notices.push(...leg.fromEstimatedCall.notices);
    }
    if (leg.toEstimatedCall?.notices) {
      notices.push(...leg.toEstimatedCall.notices);
    }
    if (leg.situations) {
      leg.situations.forEach((situation) => {
        if (situation) {
          notices.push(situation);
        }
      });
    }
  });
  return notices.filter(onlyUniquesBasedOnField('id'));
}

export function findAllSituations(
  tp: TripPatternWithBooking,
): SituationFragment[] {
  const situations: SituationFragment[] = [];
  tp.legs.forEach((leg) => {
    if (leg.situations) {
      leg.situations.forEach((situation) => {
        if (situation) {
          situations.push(situation);
        }
      });
    }
    if (leg.fromPlace.quay?.situations) {
      leg.fromPlace.quay.situations.forEach((situation) => {
        if (situation) {
          situations.push(situation);
        }
      });
    }
    if (leg.toPlace.quay?.situations) {
      leg.toPlace.quay.situations.forEach((situation) => {
        if (situation) {
          situations.push(situation);
        }
      });
    }
  });
  return situations
    .filter(isSituationValidAtDate(tp.expectedStartTime))
    .filter(onlyUniquesBasedOnField('id'));
}
