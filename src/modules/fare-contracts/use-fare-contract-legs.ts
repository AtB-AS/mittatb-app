import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {getDatedServiceJourney} from '@atb/api/bff/servicejourney';
import type {DatedServiceJourneyRefsType} from '@atb-as/utils';
import type {SalesTripPatternLeg} from '@atb/api/types/sales';
import type {DatedServiceJourney} from '@atb/api/types/generated/journey_planner_v3_types';

type FareContractLegsType = {
  legs: SalesTripPatternLeg[];
};

/**
 * When we have a DatedServiceJourneyRef, use it to fetch the
 * entire DatedServiceJourney and map it to SalesTripPatternLegs
 * which we then use
 * @param dsjRefs
 */
export function useFareContractLegs(
  dsjRefs: DatedServiceJourneyRefsType | undefined,
): FareContractLegsType {
  const {data} = useQuery({
    queryKey: ['datedServiceJourneys', dsjRefs?.datedServiceJourneyRef],
    queryFn: async () => {
      if (!!dsjRefs?.datedServiceJourneyRef) {
        return getDatedServiceJourney(dsjRefs?.datedServiceJourneyRef);
      }
    },
    staleTime: ONE_MINUTE_MS,
    cacheTime: 30 * ONE_SECOND_MS,
    refetchOnMount: 'always',
    retry: 3,
    enabled: !!dsjRefs,
  });

  if (!!data) {
    const leg = mapToSalesTripPatternLeg(
      data.data,
      dsjRefs?.startPointRef,
      dsjRefs?.endPointRef,
    );
    return {legs: leg ? [leg] : []};
  }
  return {legs: []};
}

function mapToSalesTripPatternLeg(
  datedServiceJourney: DatedServiceJourney,
  startPointId?: string,
  endPointId?: string,
): SalesTripPatternLeg | undefined {
  const estimatedCalls = datedServiceJourney.estimatedCalls;
  if (!estimatedCalls || estimatedCalls.length < 2) return undefined;
  const [fromCall, toCall] = [
    estimatedCalls.find((call) => call.quay.stopPlace?.id === startPointId),
    estimatedCalls.find((call) => call.quay.stopPlace?.id === endPointId),
  ];

  return {
    expectedStartTime: fromCall?.expectedDepartureTime ?? '',
    expectedEndTime: toCall?.expectedArrivalTime ?? '',
    fromStopPlaceId: fromCall?.quay.stopPlace?.id ?? '',
    fromStopPlaceName: fromCall?.quay.stopPlace?.name,
    toStopPlaceId: toCall?.quay.stopPlace?.id ?? '',
    toStopPlaceName: toCall?.quay.stopPlace?.name,
    serviceJourneyId: datedServiceJourney.id,
    mode: datedServiceJourney.serviceJourney.transportMode ?? '',
    subMode: datedServiceJourney.serviceJourney.transportSubmode,
    lineNumber: datedServiceJourney.serviceJourney?.line?.publicCode,
    lineName: datedServiceJourney.serviceJourney?.line?.name,
  };
}
