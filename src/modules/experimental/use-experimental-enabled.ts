import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ExperimentalFeature} from '@atb/modules/native';

export const useExperimentalEnabled = () => {
  const {isExperimentalFeaturesEnabled} = useFeatureTogglesContext();
  return (
    isExperimentalFeaturesEnabled && ExperimentalFeature.isExperimentalEnabled()
  );
};
