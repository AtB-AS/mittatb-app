import {getDepartures} from '@atb/api/serviceJourney';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {ServiceJourneyEstimatedCallFragment} from '@atb/api/types/generated/serviceJourney';
import usePollableResource from '@atb/utils/use-pollable-resource';
import {useCallback} from 'react';
import {ServiceJourneyDeparture} from './types';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';

export type DepartureData = {
  estimatedCallsWithMetadata: EstimatedCallWithMetadata[];
  mode?: TransportMode;
  title?: string;
  subMode?: TransportSubmode;
  serviceJourneySituations: SituationFragment[];
};

type EstimatedCallMetadata = {
  group: 'passed' | 'trip' | 'after';
  isStartOfServiceJourney: boolean;
  isEndOfServiceJourney: boolean;
  isStartOfGroup: boolean;
  isEndOfGroup: boolean;
};

export type EstimatedCallWithMetadata = ServiceJourneyEstimatedCallFragment & {
  metadata: EstimatedCallMetadata;
};

export default function useDepartureData(
  activeItem: ServiceJourneyDeparture,
  pollingTimeInSeconds: number = 0,
  disabled?: boolean,
): [DepartureData, boolean] {
  const getService = useCallback(
    async function getServiceJourneyDepartures(): Promise<DepartureData> {
      const estimatedCalls = await getDepartures(
        activeItem.serviceJourneyId,
        new Date(activeItem.serviceDate),
      );
      const estimatedCallsWithMetadata = addMetadataToEstimatedCalls(
        estimatedCalls,
        activeItem.fromQuayId,
        activeItem.toQuayId,
      );

      const firstCallOfTrip = estimatedCallsWithMetadata.find(
        (e) => e.metadata.group === 'trip',
      );

      const line = firstCallOfTrip?.serviceJourney?.journeyPattern?.line;
      const situations = firstCallOfTrip?.situations || [];
      const title = line?.publicCode
        ? `${line?.publicCode} ${firstCallOfTrip?.destinationDisplay?.frontText}`
        : undefined;

      return {
        mode: line?.transportMode,
        title,
        subMode: line?.transportSubmode,
        estimatedCallsWithMetadata,
        serviceJourneySituations: situations,
      };
    },
    [activeItem],
  );

  const [data, , isLoading] = usePollableResource<DepartureData>(getService, {
    initialValue: {
      estimatedCallsWithMetadata: [],
      serviceJourneySituations: [],
    },
    pollingTimeInSeconds,
    disabled: disabled || !activeItem,
  });

  return [data, isLoading];
}

function addMetadataToEstimatedCalls(
  estimatedCalls: ServiceJourneyEstimatedCallFragment[],
  fromQuayId?: string,
  toQuayId?: string,
): EstimatedCallWithMetadata[] {
  let currentGroup: EstimatedCallMetadata['group'] = 'passed';

  return estimatedCalls.reduce<EstimatedCallWithMetadata[]>(
    (calls, currentCall, index) => {
      const previousCall = calls[calls.length - 1];
      if (currentCall.quay?.id === fromQuayId) {
        if (previousCall) previousCall.metadata.isEndOfGroup = true;
        currentGroup = 'trip';
      }

      const metadata: EstimatedCallMetadata = {
        group: currentGroup,
        isStartOfServiceJourney: index === 0,
        isStartOfGroup: currentGroup !== previousCall?.metadata.group,
        isEndOfServiceJourney: index === estimatedCalls.length - 1,
        isEndOfGroup: index === estimatedCalls.length - 1,
      };

      if (currentCall.quay?.id === toQuayId) {
        metadata.isEndOfGroup = true;
        currentGroup = 'after';
      }

      return [...calls, {...currentCall, metadata}];
    },
    [],
  );
}
