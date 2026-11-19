import type {
  StopSignalButtonConfigType,
  StopSignalModeAndSubmodesType,
} from '@atb-as/config-specs';
import type {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {addMinutes, isBetween, isEqualOrAfter} from '@atb/utils/date';
import type {ServiceJourneyWithGuaranteedCalls} from './types';

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

export type StopButtonAvailability =
  | 'available'
  | 'tooEarly'
  | 'tooLate'
  | 'noRealtime';

export const getStopButtonAvailability = (
  call: EstimatedCallWithQuayFragment,
  config: StopSignalButtonConfigType,
  now: Date = new Date(),
): StopButtonAvailability => {
  if (!call.realtime || !call.expectedArrivalTime) return 'noRealtime';

  const activationWindowStart = addMinutes(
    call.expectedArrivalTime,
    -config.activationWindowStartMinutesBefore,
  );
  const activationWindowEnd = addMinutes(
    call.expectedArrivalTime,
    -config.activationWindowEndMinutesBefore,
  );

  if (isBetween(now, activationWindowStart, activationWindowEnd)) {
    return 'available';
  }
  return isEqualOrAfter(now, activationWindowEnd) ? 'tooLate' : 'tooEarly';
};
