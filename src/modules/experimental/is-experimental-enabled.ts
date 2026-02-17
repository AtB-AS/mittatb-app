import {ExperimentalFeature} from '@atb/modules/native';
import {getBooleanConfigValue} from '../remote-config/remote-config';
import {useFeatureTogglesContext} from '../feature-toggles';

/**
 * Evaluates two conditions:
 * 1. Whether the experimental feature is enabled in the remote config. This cannot be overridden in the debug menu at runtime.
 * 2. Whether the current release channel is a non-production release channel.
 */
export const isExperimentalEnabled = () => {
  return (
    getBooleanConfigValue('enable_experimental_features') &&
    ExperimentalFeature.isNonProductionReleaseChannel()
  );
};

/**
 * Evaluates two conditions:
 * 1. Whether the experimental feature toggle is enabled. This means it can be overridden in the debug menu.
 * 2. Whether the current release channel is a non-production release channel.
 */
export const useIsExperimentalEnabled = () => {
  const {isExperimentalFeaturesEnabled} = useFeatureTogglesContext();
  return (
    isExperimentalFeaturesEnabled &&
    ExperimentalFeature.isNonProductionReleaseChannel()
  );
};
