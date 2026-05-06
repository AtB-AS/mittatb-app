import {useIsExperimentalEnabled} from '@atb/modules/experimental';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const useNewTripDetailScreenEnabled = (): boolean => {
  const isExperimental = useIsExperimentalEnabled();
  const {isNewTripDetailScreenEnabled} = useFeatureTogglesContext();
  return isExperimental || isNewTripDetailScreenEnabled;
};
