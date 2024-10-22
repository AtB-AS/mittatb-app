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
  const selectedCallIndex =
    estimatedCalls.findIndex(
      // TODO: This can be wrong if there are multiple stops on the same quay
      (estimatedCall) => estimatedCall.quay?.id === fromQuayId,
    ) ?? 0;
  const selectedCall: EstimatedCallWithQuayFragment =
    estimatedCalls[selectedCallIndex];

  let previousOrCurrentCallIndex = -1;
  estimatedCalls.forEach((estimatedCall, index) => {
    if (estimatedCall.actualDepartureTime || estimatedCall.actualArrivalTime) {
      previousOrCurrentCallIndex = index;
    }
  });
  const previousOrCurrentCall = estimatedCalls[previousOrCurrentCallIndex] as
    | EstimatedCallWithQuayFragment
    | undefined;
  const nextCall = estimatedCalls[previousOrCurrentCallIndex + 1] as
    | EstimatedCallWithQuayFragment
    | undefined;

  // No realtime data
  if (!selectedCall.realtime) {
    return {
      status: TravelAidStatus.NoRealtime,
      focusedEstimatedCall: selectedCall,
    };
  }

  // Data on service journey progress
  if (previousOrCurrentCall) {
    // Has not yet arrived at the selected stop
    if (selectedCallIndex > previousOrCurrentCallIndex) {
      return {
        status: TravelAidStatus.NotYetArrived,
        focusedEstimatedCall: selectedCall,
      };
    }

    // Has arrived, but not departed the stop
    if (
      previousOrCurrentCall.actualArrivalTime &&
      !previousOrCurrentCall.actualDepartureTime
    ) {
      return {
        status: TravelAidStatus.Arrived,
        focusedEstimatedCall: previousOrCurrentCall,
      };
    }

    // Has passed the last stop
    if (nextCall === undefined) {
      return {
        status: TravelAidStatus.EndOfLine,
        focusedEstimatedCall: previousOrCurrentCall,
      };
    }

    // On its way to the next stop
    if (previousOrCurrentCall.actualDepartureTime && nextCall) {
      return {
        status: TravelAidStatus.BetweenStops,
        focusedEstimatedCall: nextCall,
      };
    }
  }

  // No data on service journey progress

  // Has realtime, should have started, but no actual departure time
  if (isInThePast(estimatedCalls[0].aimedDepartureTime)) {
    return {
      status: TravelAidStatus.NotGettingUpdates,
      focusedEstimatedCall: selectedCall,
    };
  }

  // Has not yet started
  return {
    status: TravelAidStatus.NotYetArrived,
    focusedEstimatedCall: selectedCall,
  };
};
