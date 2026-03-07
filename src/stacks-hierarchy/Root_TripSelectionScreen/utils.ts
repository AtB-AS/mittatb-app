import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import type {OfferSearchLeg} from '@atb/api/types/sales';

export function mapToOfferSearchLegs(
  legs: TripPatternFragment['legs'],
): OfferSearchLeg[] {
  return legs.map((l) => ({
    fromStopPlaceId: l.fromPlace.quay?.stopPlace?.id ?? '',
    toStopPlaceId: l.toPlace.quay?.stopPlace?.id ?? '',
    mode: l.mode,
    serviceJourneyId: l.serviceJourney?.id ?? '',
    travelDate: l.expectedStartTime.split('T')[0] as string,
  }));
}
