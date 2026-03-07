import {ExperimentalFeature} from '@atb/modules/native';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useTicketingContext} from '../ticketing/TicketingContext';

/**
 * Evaluates two conditions:
 * 1. Whether the experimental feature toggle is enabled. This means it can be overridden in the debug menu.
 * 2. Whether the current release channel is a non-production release channel.
 */
export const useIsExperimentalEnabled = () => {
  const {isExperimentalFeaturesEnabled} = useFeatureTogglesContext();
  const {customerProfile} = useTicketingContext();
  return (
    isExperimentalFeaturesEnabled &&
    (ExperimentalFeature.isNonProductionReleaseChannel() ||
      customerProfile?.debug)
  );
};
