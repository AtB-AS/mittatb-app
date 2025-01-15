import {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {minutesBetween} from '@atb/utils/date';
import {getCallByStopPosition} from '@atb/travel-details-screens/utils';

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
  fromStopPosition: number,
): FocusedEstimatedCallState => {
  const selectedCall = getCallByStopPosition(estimatedCalls, fromStopPosition);

  let previousOrCurrentCallIndex = -1;
  estimatedCalls.forEach((estimatedCall, index) => {
    if (estimatedCall.actualDepartureTime || estimatedCall.actualArrivalTime) {
      previousOrCurrentCallIndex = index;
    }
  });
  const previousOrCurrentCall =
    previousOrCurrentCallIndex >= 0
      ? estimatedCalls.at(previousOrCurrentCallIndex)
      : undefined;
  const nextCall = estimatedCalls.at(previousOrCurrentCallIndex + 1);

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
    if (fromStopPosition > previousOrCurrentCall.stopPositionInPattern) {
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
  if (minutesBetween(estimatedCalls[0].aimedDepartureTime, new Date()) > 2) {
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
