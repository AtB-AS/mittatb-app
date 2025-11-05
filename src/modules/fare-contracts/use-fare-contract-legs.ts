import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {getDatedServiceJourney} from '@atb/api/bff/servicejourney';
import type {DatedServiceJourneyRefsType} from '@atb-as/utils';
import {
  type DatedServiceJourney,
  Mode,
  TransportMode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import type {Leg} from '@atb/api/types/trips';

/**
 * When we have a DatedServiceJourneyRef, use it to fetch the
 * entire DatedServiceJourney and map it to SalesTripPatternLegs
 * which we then use
 * @param dsjRefs
 */
export function useFareContractLegs(
  dsjRefs: DatedServiceJourneyRefsType | undefined,
) {
  const {data} = useQuery({
    queryKey: ['datedServiceJourneys', dsjRefs?.datedServiceJourneyRef],
    queryFn: async () =>
      getDatedServiceJourney(dsjRefs?.datedServiceJourneyRef),
    staleTime: ONE_MINUTE_MS,
    gcTime: 30 * ONE_SECOND_MS,
    refetchOnMount: 'always',
    retry: 3,
    enabled: !!dsjRefs,
  });

  if (!!data) {
    const leg = mapToLeg(
      data.data,
      dsjRefs?.startPointRef,
      dsjRefs?.endPointRef,
    );
    if (!!leg) return [leg];
  }
  return [];
}

function mapToLeg(
  datedServiceJourney: DatedServiceJourney,
  startPointId?: string,
  endPointId?: string,
): Leg | undefined {
  const estimatedCalls = datedServiceJourney.estimatedCalls;
  if (!estimatedCalls || estimatedCalls.length < 2) return undefined;
  const [fromCallIndex, toCallIndex] = [
    estimatedCalls.findIndex(
      (call) => call.quay.stopPlace?.id === startPointId,
    ),
    estimatedCalls.findIndex((call) => call.quay.stopPlace?.id === endPointId),
  ];
  const [fromCall, toCall] = [
    estimatedCalls[fromCallIndex],
    estimatedCalls[toCallIndex],
  ];

  return {
    distance: 0, // Distance is not provided in the DatedServiceJourney
    duration: 0, // Duration is not provided in the DatedServiceJourney
    aimedStartTime: fromCall?.aimedDepartureTime,
    expectedStartTime: fromCall?.expectedDepartureTime,
    aimedEndTime: toCall?.aimedArrivalTime,
    expectedEndTime: toCall?.expectedArrivalTime,
    fromPlace: {
      quay: fromCall?.quay,
      longitude: fromCall?.quay.stopPlace?.longitude ?? 0,
      latitude: fromCall?.quay.stopPlace?.latitude ?? 0,
    },
    toPlace: {
      quay: toCall?.quay,
      longitude: toCall?.quay.stopPlace?.longitude ?? 0,
      latitude: toCall?.quay.stopPlace?.latitude ?? 0,
    },
    datedServiceJourney,
    mode:
      mapTransportModeToMode(
        datedServiceJourney.serviceJourney.transportMode,
      ) ?? Mode.Water,
    serviceJourney: datedServiceJourney.serviceJourney,
    realtime: false,
    situations: datedServiceJourney.serviceJourney.situations,
    intermediateEstimatedCalls: estimatedCalls.slice(
      fromCallIndex + 1,
      toCallIndex,
    ),
    serviceJourneyEstimatedCalls: estimatedCalls,
    fromEstimatedCall: fromCall,
    toEstimatedCall: toCall,
    line: datedServiceJourney.serviceJourney.line,
  };
}

// Utility function to map TransportMode to Mode
export function mapTransportModeToMode(mode?: TransportMode): Mode | undefined {
  switch (mode) {
    case TransportMode.Bus:
      return Mode.Bus;
    case TransportMode.Tram:
      return Mode.Tram;
    case TransportMode.Metro:
      return Mode.Metro;
    case TransportMode.Rail:
      return Mode.Rail;
    case TransportMode.Water:
      return Mode.Water;
    case TransportMode.Air:
      return Mode.Air;
    case TransportMode.Cableway:
      return Mode.Cableway;
    case TransportMode.Funicular:
      return Mode.Funicular;
    case TransportMode.Trolleybus:
      return Mode.Trolleybus;
    case TransportMode.Coach:
      return Mode.Coach;
    case TransportMode.Unknown:
      return undefined;
    default:
      return undefined;
  }
}
