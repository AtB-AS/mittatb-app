import {Leg, Quay} from '../../sdk';

export function getLineName(leg: Leg) {
  return leg.line
    ? leg.line.publicCode +
        ' ' +
        leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line.name
    : 'Ukjent';
}

export function getQuayName(quay: Quay) {
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}
