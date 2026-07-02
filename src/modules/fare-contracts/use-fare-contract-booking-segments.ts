import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {getDatedServiceJourney} from '@atb/api/bff/servicejourney';
import type {DatedServiceJourneyRefsType} from '@atb-as/utils';
import {
  Mode,
  TransportMode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import type {DatedServiceJourney} from '@atb/api/bff/types';
import type {BookingJourneySegment} from '@atb/components/booking-summary';

/**
 * Fetches the DatedServiceJourney referenced by a fare contract's travel right
 * and maps it to a single BookingJourneySegment to be rendered by BookingSummary.
 */
export function useFareContractBookingSegments(
  dsjRefs: DatedServiceJourneyRefsType | undefined,
): BookingJourneySegment[] {
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

  if (data?.data) {
    const segment = mapToBookingJourneySegment(
      data.data,
      dsjRefs?.startPointRef,
      dsjRefs?.endPointRef,
    );
    if (segment) return [segment];
  }
  return [];
}

function mapToBookingJourneySegment(
  datedServiceJourney: DatedServiceJourney,
  startPointId?: string,
  endPointId?: string,
): BookingJourneySegment | undefined {
  const estimatedCalls = datedServiceJourney.estimatedCalls;
  if (!estimatedCalls || estimatedCalls.length < 2) return undefined;
  const fromCall = estimatedCalls.find(
    (call) => call.quay.stopPlace?.id === startPointId,
  );
  const toCall = estimatedCalls.find(
    (call) => call.quay.stopPlace?.id === endPointId,
  );

  return {
    mode:
      mapTransportModeToMode(
        datedServiceJourney.serviceJourney.transportMode,
      ) ?? Mode.Water,
    transportSubmode: datedServiceJourney.serviceJourney.transportSubmode,
    line: datedServiceJourney.serviceJourney.line,
    expectedStartTime: fromCall?.expectedDepartureTime,
    expectedEndTime: toCall?.expectedArrivalTime,
    fromStopName: fromCall?.quay.stopPlace?.name,
    toStopName: toCall?.quay.stopPlace?.name,
    situations: datedServiceJourney.serviceJourney.situations,
    notices: [],
  };
}

function mapTransportModeToMode(mode?: TransportMode): Mode | undefined {
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
