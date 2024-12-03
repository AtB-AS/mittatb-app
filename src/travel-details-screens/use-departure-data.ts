import {getServiceJourneyWithEstimatedCalls} from '@atb/api/serviceJourney';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {usePollableResource} from '@atb/utils/use-pollable-resource';
import {useCallback} from 'react';
import {ServiceJourneyDeparture} from './types';
import {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {
  formatDestinationDisplay,
  getNoticesForServiceJourney,
} from '@atb/travel-details-screens/utils';
import {useTranslation} from '@atb/translations';
import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys.ts';

export type DepartureData = {
  serviceJourney?: ServiceJourneyWithEstCallsFragment;
  estimatedCallsWithMetadata: EstimatedCallWithMetadata[];
  mode?: TransportMode;
  title?: string;
  subMode?: TransportSubmode;
  situations: SituationFragment[];
  notices: NoticeFragment[];
};

type EstimatedCallMetadata = {
  group: 'passed' | 'trip' | 'after';
  isStartOfServiceJourney: boolean;
  isEndOfServiceJourney: boolean;
  isStartOfGroup: boolean;
  isEndOfGroup: boolean;
};

export type EstimatedCallWithMetadata = EstimatedCallWithQuayFragment & {
  metadata: EstimatedCallMetadata;
};

export function useDepartureData(
  activeItem: ServiceJourneyDeparture,
  pollingTimeInSeconds: number = 0,
): [DepartureData, boolean] {
  const {t} = useTranslation();
  const getService = useCallback(
    async function (): Promise<DepartureData> {
      const serviceJourney = await getServiceJourneyWithEstimatedCalls(
        activeItem.serviceJourneyId,
        activeItem.serviceDate,
      );
      const estimatedCallsWithMetadata = addMetadataToEstimatedCalls(
        serviceJourney.estimatedCalls || [],
        activeItem.fromQuayId,
        activeItem.toQuayId,
      );

      const focusedEstimatedCall = estimatedCallsWithMetadata.find(
        (e) => e.metadata.group === 'trip',
      )!;

      const title = `${formatDestinationDisplay(
        t,
        focusedEstimatedCall.destinationDisplay,
      )}`;
      const notices = getNoticesForServiceJourney(
        serviceJourney,
        activeItem.fromQuayId,
      );

      const situations = focusedEstimatedCall.situations.sort((n1, n2) =>
        n1.id.localeCompare(n2.id),
      );

      return {
        serviceJourney,
        mode: serviceJourney.transportMode,
        title,
        subMode: serviceJourney.transportSubmode,
        estimatedCallsWithMetadata,
        situations,
        notices,
      };
    },
    [activeItem, t],
  );

  const [data, , isLoading] = usePollableResource<DepartureData>(getService, {
    initialValue: {
      estimatedCallsWithMetadata: [],
      situations: [],
      notices: [],
    },
    pollingTimeInSeconds,
    disabled: !activeItem,
    pollOnFocus: true,
  });

  return [data, isLoading];
}

function addMetadataToEstimatedCalls(
  estimatedCalls: EstimatedCallWithQuayFragment[],
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
