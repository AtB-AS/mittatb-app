import {Leg, EstimatedCall, Quay, ServiceJourney} from '../sdk';

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

export function getQuayName(quay?: Quay, defaultName: string = 'Ukjent') {
  if (!quay) return defaultName;
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}
