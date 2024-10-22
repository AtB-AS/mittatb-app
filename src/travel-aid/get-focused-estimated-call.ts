import {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {isInThePast} from '@atb/utils/date';

export enum TravelAidStatus {
  /** Not yet arrived at the selected stop */
  NotYetArrived,
  /** Arrived, but not yet departed a stop */
  Arrived,
  /** Departed a stop, but not yet arrived at the next */
  BetweenStops,
  /** Departed from the last stop */
  EndOfLine,
  /** No realtime data */
  NoRealtime,
  /** Has realtime, should have started, but no actual departure time */
  NotGettingUpdates,
}

export type FocusedEstimatedCallState = {
  status: TravelAidStatus;
  focusedEstimatedCall: EstimatedCallWithQuayFragment;
};

export const getFocusedEstimatedCall = (
  estimatedCalls: EstimatedCallWithQuayFragment[],
  fromQuayId?: string,
): FocusedEstimatedCallState => {
  const selectedStopIndex =
    estimatedCalls.findIndex(
      // TODO: This can be wrong if there are multiple stops on the same quay
      (estimatedCall) => estimatedCall.quay?.id === fromQuayId,
    ) ?? 0;
  const selectedStop: EstimatedCallWithQuayFragment =
    estimatedCalls[selectedStopIndex];

  let previousOrCurrentStopIndex = -1;
  estimatedCalls.forEach((estimatedCall, index) => {
    if (estimatedCall.actualDepartureTime || estimatedCall.actualArrivalTime) {
      previousOrCurrentStopIndex = index;
    }
  });
  const previousOrCurrentStop = estimatedCalls[previousOrCurrentStopIndex] as
    | EstimatedCallWithQuayFragment
    | undefined;
  const nextStop = estimatedCalls[previousOrCurrentStopIndex + 1] as
    | EstimatedCallWithQuayFragment
    | undefined;

  // No realtime data
  if (!selectedStop.realtime) {
    return {
      status: TravelAidStatus.NoRealtime,
      focusedEstimatedCall: selectedStop,
    };
  }

  // Data on service journey progress
  if (previousOrCurrentStop) {
    // Has not yet arrived at the selected stop
    if (selectedStopIndex > previousOrCurrentStopIndex) {
      return {
        status: TravelAidStatus.NotYetArrived,
        focusedEstimatedCall: selectedStop,
      };
    }

    // Has arrived, but not departed the stop
    if (
      previousOrCurrentStop.actualArrivalTime &&
      !previousOrCurrentStop.actualDepartureTime
    ) {
      return {
        status: TravelAidStatus.Arrived,
        focusedEstimatedCall: previousOrCurrentStop,
      };
    }

    // Has passed the last stop
    if (nextStop === undefined) {
      return {
        status: TravelAidStatus.EndOfLine,
        focusedEstimatedCall: previousOrCurrentStop,
      };
    }

    // On its way to the next stop
    if (previousOrCurrentStop.actualDepartureTime && nextStop) {
      return {
        status: TravelAidStatus.BetweenStops,
        focusedEstimatedCall: nextStop,
      };
    }
  }

  // No data on service journey progress

  // Has realtime, should have started, but no actual departure time
  if (isInThePast(estimatedCalls[0].aimedDepartureTime)) {
    return {
      status: TravelAidStatus.NotGettingUpdates,
      focusedEstimatedCall: selectedStop,
    };
  }

  // Has not yet started
  return {
    status: TravelAidStatus.NotYetArrived,
    focusedEstimatedCall: selectedStop,
  };
};
