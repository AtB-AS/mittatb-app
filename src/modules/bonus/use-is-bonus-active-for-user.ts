import {KnownProgramId, useIsEnrolled} from '@atb/modules/enrollment';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export function useIsBonusActiveForUser(): boolean {
  const {isBonusEnabled} = useFeatureTogglesContext();
  const isEnrolled = useIsEnrolled(KnownProgramId.BONUS, !isBonusEnabled);
  return isBonusEnabled && isEnrolled;
}
