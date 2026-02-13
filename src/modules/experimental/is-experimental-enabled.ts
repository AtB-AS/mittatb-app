import {ExperimentalFeature} from '@atb/modules/native';

export const isExperimentalEnabled = () => {
  return ExperimentalFeature.isExperimentalEnabled();
};
