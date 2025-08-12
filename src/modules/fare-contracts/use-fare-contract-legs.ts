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
    return {legs: mapToSalesTripPatternLegs(data.data)};
  }
  return {legs: []};
}

function mapToSalesTripPatternLegs(
  datedServiceJourney: DatedServiceJourney,
): SalesTripPatternLeg[] {
  const estimatedCalls =
    datedServiceJourney.journeyPattern?.serviceJourneysForDate?.[0]
      ?.estimatedCalls;
  if (!estimatedCalls || estimatedCalls.length < 2) return [];
  return estimatedCalls.slice(0, -1).map((fromCall, idx) => {
    const toCall = estimatedCalls[idx + 1];
    return {
      expectedStartTime: fromCall.expectedDepartureTime ?? '',
      expectedEndTime: toCall.expectedArrivalTime ?? '',
      fromStopPlaceId: fromCall.quay.stopPlace?.id ?? '',
      fromStopPlaceName: fromCall.quay.stopPlace?.name,
      toStopPlaceId: toCall.quay.stopPlace?.id ?? '',
      toStopPlaceName: toCall.quay.stopPlace?.name,
      serviceJourneyId: datedServiceJourney.id,
      mode: datedServiceJourney.journeyPattern?.line.transportMode ?? '',
      subMode: datedServiceJourney.journeyPattern?.line?.transportSubmode,
      lineNumber: datedServiceJourney.journeyPattern?.line?.publicCode,
      lineName: datedServiceJourney.journeyPattern?.line?.name,
    };
  });
}
