import {ExperimentalFeature} from '@atb/modules/native';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useTicketingContext} from '../ticketing/TicketingContext';
import type {FeatureToggleNames} from '@atb/modules/feature-toggles';

/**
 * Evaluates two conditions:
 * 1. Whether the experimental feature toggle is enabled. This means it can be overridden in the debug menu.
 * 2. Whether the current release channel is a non-production release channel.
 *
 * Optionally accepts a feature toggle name. If provided, the feature is also
 * considered enabled when that specific toggle is true (via override or remote config).
 */
export const useIsExperimentalEnabled = (
  featureToggleName?: FeatureToggleNames,
) => {
  const featureToggles = useFeatureTogglesContext();
  const {customerProfile} = useTicketingContext();

  return (
    (featureToggles.isExperimentalFeaturesEnabled &&
      (ExperimentalFeature.isNonProductionReleaseChannel() ||
        customerProfile?.debug)) ||
    (featureToggleName ? featureToggles[featureToggleName] : false)
  );
};
