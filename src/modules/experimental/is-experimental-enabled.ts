import {ExperimentalFeature} from '@atb/modules/native';
import {getBooleanConfigValue} from '../remote-config/remote-config';

export const isExperimentalEnabled = () => {
  return (
    !getBooleanConfigValue('disable_experimental_features') &&
    ExperimentalFeature.isExperimentalEnabled()
  );
};
