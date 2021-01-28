import {parseISO} from 'date-fns';
import {useCallback} from 'react';
import {getDepartures} from '../../../api/serviceJourney';
import {
  EstimatedCall,
  Situation,
  TransportMode,
  TransportSubmode,
} from '../../../sdk';
import usePollableResource from '../../../utils/use-pollable-resource';
import {ServiceJourneyDeparture} from './types';

export type DepartureData = {
  callGroups: CallListGroup;
  mode?: TransportMode;
  title?: string;
  subMode?: TransportSubmode;
  situations: Situation[];
};

export type CallListGroup = {
  passed: EstimatedCall[];
  trip: EstimatedCall[];
  after: EstimatedCall[];
};

export default function useDepartureData(
  activeItem: ServiceJourneyDeparture,
  pollingTimeInSeconds: number = 0,
  disabled?: boolean,
): [DepartureData, boolean] {
  const getService = useCallback(
    async function getServiceJourneyDepartures(): Promise<DepartureData> {
      const deps = await getDepartures(
        activeItem.serviceJourneyId,
        parseISO(activeItem.date),
      );
      const callGroups = groupAllCallsByQuaysInLeg(
        deps,
        activeItem.fromQuayId,
        activeItem.toQuayId,
      );
      const line = callGroups.trip[0]?.serviceJourney?.journeyPattern?.line;
      const parentSituation = callGroups.trip[0]?.situations;

      return {
        mode: line?.transportMode,
        title: `${line?.publicCode} ${callGroups.trip[0]?.destinationDisplay.frontText}`,
        subMode: line?.transportSubmode,
        callGroups,
        situations: parentSituation,
      };
    },
    [activeItem],
  );

  const [data, , isLoading] = usePollableResource<DepartureData>(getService, {
    initialValue: {
      callGroups: {
        passed: [],
        trip: [],
        after: [],
      },
      situations: [],
    },
    pollingTimeInSeconds,
    disabled: disabled || !activeItem,
  });

  return [data, isLoading];
}

const onType = (
  obj: CallListGroup,
  key: keyof CallListGroup,
  call: EstimatedCall,
): CallListGroup => ({
  ...obj,
  [key]: obj[key].concat(call),
});
function groupAllCallsByQuaysInLeg(
  calls: EstimatedCall[],
  fromQuayId?: string,
  toQuayId?: string,
): CallListGroup {
  let isAfterStart = false;
  let isAfterStop = false;

  if (!fromQuayId && !toQuayId) {
    return {
      passed: [],
      trip: calls,
      after: [],
    };
  }

  return calls.reduce(
    (obj, call) => {
      // We are at start quay, update flag
      if (call.quay?.id === fromQuayId) {
        isAfterStart = true;
      }

      if (!isAfterStart && !isAfterStop) {
        // is the first group
        obj = onType(obj, 'passed', call);
      } else if (isAfterStart && !isAfterStop) {
        // is the current route (between start/stop)
        obj = onType(obj, 'trip', call);
      } else {
        // is quays after stop
        obj = onType(obj, 'after', call);
      }

      // We are at stop, update flag
      if (call.quay?.id === toQuayId) {
        isAfterStop = true;
      }

      return obj;
    },
    {
      passed: [],
      trip: [],
      after: [],
    } as CallListGroup,
  );
}
