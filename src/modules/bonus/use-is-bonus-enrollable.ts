import {KnownProgramId, useProgramQuery} from '@atb/modules/enrollment';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export function useIsBonusEnrollable(): boolean {
  const {isBonusEnabled} = useFeatureTogglesContext();
  const bonusProgram = useProgramQuery(KnownProgramId.BONUS, !isBonusEnabled);

  return Boolean(
    isBonusEnabled && bonusProgram?.isOpen && bonusProgram?.isActive,
  );
}
