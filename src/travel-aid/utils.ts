import type {StopSignalModeAndSubmodesType} from '@atb-as/config-specs';
import type {ServiceJourneyWithGuaranteedCalls} from '@atb/travel-aid/types';

export const isApplicableTransportMode = (
  configModes: StopSignalModeAndSubmodesType[],
  serviceJourney: ServiceJourneyWithGuaranteedCalls,
): boolean => {
  if (!serviceJourney.transportMode) return false;
  return configModes.some(({mode, submodes}) => {
    if (mode !== serviceJourney.transportMode) return false;
    if (!submodes?.length) return true;
    if (!serviceJourney.transportSubmode) return false;
    return submodes?.some((sm) => sm === serviceJourney.transportSubmode);
  });
};
