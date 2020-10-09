import {EstimatedCall, Leg, Quay, LegMode} from '../sdk';

export function getLineName(leg: Leg) {
  return leg.line
    ? leg.line.publicCode +
        ' ' +
        leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line.name
    : 'Ukjent';
}

export function getLineNameFromEstimatedCall(
  call: EstimatedCall,
): {publicCode?: string; name: string} {
  const name =
    call.destinationDisplay?.frontText ??
    call.serviceJourney.journeyPattern?.line.name;

  const publicCode = call.serviceJourney.journeyPattern?.line.publicCode;

  if (!publicCode && !name) {
    return {name: 'Ukjent'};
  }
  if (!publicCode) {
    return {name};
  }
  return {publicCode, name};
}
export function getReadableModeName(mode: LegMode): string {
  switch (mode) {
    case 'bus':
      return 'Buss';
    case 'rail':
      return 'Tog';
    case 'tram':
      return 'Trikk';
    case 'water':
      return 'Båt';
    case 'air':
      return 'Fly';
    case 'foot':
    default:
      return 'Gange';
  }
}

export function getQuayName(quay?: Quay, defaultName: string = 'Ukjent') {
  if (!quay) return defaultName;
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}

export function getQuayNameFromStartLeg(
  leg?: Leg,
  defaultName: string = 'Ukjent',
) {
  if (leg?.fromEstimatedCall?.quay) {
    return getQuayName(leg?.fromEstimatedCall?.quay);
  }
  if (leg?.fromPlace.quay) {
    return getQuayName(leg?.fromPlace.quay);
  }
  return leg?.fromPlace.name ?? defaultName;
}

export function getQuayNameFromStopLeg(
  leg?: Leg,
  defaultName: string = 'Ukjent',
) {
  if (leg?.fromEstimatedCall?.quay) {
    return getQuayName(leg?.toEstimatedCall?.quay);
  }
  if (leg?.fromPlace.quay) {
    return getQuayName(leg?.toPlace.quay);
  }
  return leg?.fromPlace.name ?? defaultName;
}
