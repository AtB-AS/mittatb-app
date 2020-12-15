import {EstimatedCall, Leg, Quay, LegMode} from '../sdk';
import {TranslatedString, dictionary} from '../translations';

export function getLineName(leg: Leg) {
  return leg.line
    ? leg.line.publicCode +
        ' ' +
        leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line.name
    : '';
}

export function getLineNameFromEstimatedCall(
  call: EstimatedCall,
): {publicCode?: string; name?: string} {
  const name =
    call.destinationDisplay?.frontText ??
    call.serviceJourney.journeyPattern?.line.name;

  const publicCode = call.serviceJourney.journeyPattern?.line.publicCode;

  if (!publicCode && !name) {
    return {};
  }
  if (!publicCode) {
    return {name};
  }
  return {publicCode, name};
}
export function getTranslatedModeName(mode?: LegMode): TranslatedString {
  const legModeNames = dictionary.travel.legModes;
  switch (mode) {
    case 'bus':
      return legModeNames.bus;
    case 'rail':
      return legModeNames.rail;
    case 'tram':
      return legModeNames.tram;
    case 'water':
      return legModeNames.water;
    case 'air':
      return legModeNames.air;
    case 'foot':
      return legModeNames.foot;
    default:
      return legModeNames.unknown;
  }
}

export function getQuayName(quay?: Quay): string | undefined {
  if (!quay) return;
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}

export function getQuayNameFromStartLeg(leg?: Leg): string | undefined {
  if (leg?.fromEstimatedCall?.quay) {
    return getQuayName(leg?.fromEstimatedCall?.quay);
  }
  if (leg?.fromPlace.quay) {
    return getQuayName(leg?.fromPlace.quay);
  }
  return leg?.fromPlace.name;
}

export function getQuayNameFromStopLeg(leg?: Leg): string | undefined {
  if (leg?.fromEstimatedCall?.quay) {
    return getQuayName(leg?.toEstimatedCall?.quay);
  }
  if (leg?.fromPlace.quay) {
    return getQuayName(leg?.toPlace.quay);
  }
  return leg?.fromPlace.name;
}
