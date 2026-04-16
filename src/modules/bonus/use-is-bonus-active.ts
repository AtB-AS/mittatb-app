import {KnownProgramId, useIsEnrolled} from '@atb/modules/enrollment';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export function useIsBonusActiveForUser(): boolean {
  const {isPointsEnabled} = useFeatureTogglesContext();
  return useIsEnrolled(KnownProgramId.BONUS, !isPointsEnabled);
}
