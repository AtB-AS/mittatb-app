import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';
import {isInThePast} from '@atb/utils/date';

type EstimatedCall = Required<
  Required<ServiceJourneyWithEstCallsFragment>['estimatedCalls']
>[0];
export type TravelAidStatus =
  | 'not-yet-arrived'
  | 'arrived'
  | 'departed'
  | 'end-of-line'
  | 'no-realtime'
  | 'not-getting-updates';
export type FocusedEstimatedCallState = {
  status: TravelAidStatus;
  focusedEstimatedCall: EstimatedCall;
};

export const getFocusedEstimatedCall = (
  estimatedCalls: EstimatedCall[],
  fromQuayId?: string,
): FocusedEstimatedCallState => {
  const selectedStopIndex =
    estimatedCalls.findIndex(
      // TODO: This can be wrong if there are multiple stops on the same quay
      (estimatedCall) => estimatedCall.quay?.id === fromQuayId,
    ) ?? 0;
  const selectedStop: EstimatedCall = estimatedCalls[selectedStopIndex];

  let previousOrCurrentStopIndex = -1;
  estimatedCalls.forEach((estimatedCall, index) => {
    if (estimatedCall.actualDepartureTime || estimatedCall.actualArrivalTime) {
      previousOrCurrentStopIndex = index;
    }
  });
  const previousOrCurrentStop = estimatedCalls[previousOrCurrentStopIndex] as
    | EstimatedCall
    | undefined;
  const nextStop = estimatedCalls[previousOrCurrentStopIndex + 1] as
    | EstimatedCall
    | undefined;

  // No realtime data
  if (!selectedStop.realtime) {
    return {
      status: 'no-realtime',
      focusedEstimatedCall: selectedStop,
    };
  }

  // Has data on service journey progress
  if (previousOrCurrentStop) {
    // Has not yet arrived at the selected stop
    if (selectedStopIndex > previousOrCurrentStopIndex) {
      return {
        status: 'not-yet-arrived',
        focusedEstimatedCall: selectedStop,
      };
    }

    // Has arrived, but not departed the stop
    if (
      previousOrCurrentStop.actualArrivalTime &&
      !previousOrCurrentStop.actualDepartureTime
    ) {
      return {
        status: 'arrived',
        focusedEstimatedCall: previousOrCurrentStop,
      };
    }

    // Has passed the last stop
    if (nextStop === undefined) {
      return {
        status: 'end-of-line',
        focusedEstimatedCall: previousOrCurrentStop,
      };
    }

    // On its way to the next stop
    if (previousOrCurrentStop.actualDepartureTime && nextStop) {
      return {
        status: 'departed',
        focusedEstimatedCall: nextStop,
      };
    }
  }

  // No data on service journey progress

  // Has realtime, should have started, but no actual departure time
  if (isInThePast(selectedStop.aimedDepartureTime)) {
    // TODO: Should we check against aimed departure time from the first or selected stop?
    // if (isInThePast(estimatedCalls[0].aimedDepartureTime)) {
    return {
      status: 'not-getting-updates',
      focusedEstimatedCall: selectedStop,
    };
  }

  // Has not yet started
  return {
    status: 'not-yet-arrived',
    focusedEstimatedCall: selectedStop,
  };
};
