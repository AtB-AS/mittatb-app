import type {TranslateFunction} from '@atb/translations';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';

export function mapToSalesTripPatternLegs(
  t: TranslateFunction,
  legs: TripPatternFragment['legs'],
) {
  return legs.map((l) => ({
    fromStopPlaceId: l.fromPlace.quay?.stopPlace?.id ?? '',
    fromStopPlaceName: l.fromPlace.quay?.stopPlace?.name ?? '',
    toStopPlaceId: l.toPlace.quay?.stopPlace?.id ?? '',
    toStopPlaceName: l.toPlace.quay?.stopPlace?.name ?? '',
    expectedStartTime: l.expectedStartTime,
    expectedEndTime: l.expectedEndTime,
    mode: l.mode,
    subMode: l.transportSubmode,
    serviceJourneyId: l.serviceJourney?.id ?? '',
    lineNumber: l.line?.publicCode ?? '',
    lineName: formatDestinationDisplay(
      t,
      l.fromEstimatedCall?.destinationDisplay,
    ),
  }));
}
