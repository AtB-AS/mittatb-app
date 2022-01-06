import {EstimatedCall, Leg, Quay} from '../sdk';
import {Quay as Quay_v3} from '../api/types/trips';
import {TranslatedString, dictionary} from '../translations';
import {AnyMode} from '@atb/components/transportation-icon';

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
export function getTranslatedModeName(mode?: AnyMode): TranslatedString {
  const legModeNames = dictionary.travel.legModes;
  switch (mode) {
    case 'bus':
    case 'coach':
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

export function getQuayName(quay?: Quay | Quay_v3): string | undefined {
  if (!quay) return;
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}
