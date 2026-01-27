import {Quay as Quay_v2} from '../api/types/trips';
import {dictionary, TranslatedString} from '../translations';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {QuayFragment} from '@atb/api/types/generated/fragments/quays';
import {Quay} from '@atb/api/types/generated/journey_planner_v3_types';

export function getTranslatedModeName(
  mode?: AnyMode,
  subMode?: AnySubMode,
  isDefinite: boolean = false,
): TranslatedString {
  const legModeNames = dictionary.travel.legModes;
  const legSubModeNames = dictionary.travel.legSubModes;

  let result: TranslatedString & {definite: TranslatedString};

  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'nightBus') {
        result = legSubModeNames.nightBus;
        break;
      }
      result = legModeNames.bus;
      break;
    case 'rail':
      result = legModeNames.rail;
      break;
    case 'tram':
      result = legModeNames.tram;
      break;
    case 'water':
      result = legModeNames.water;
      break;
    case 'air':
      result = legModeNames.air;
      break;
    case 'foot':
      result = legModeNames.foot;
      break;
    case 'metro':
      result = legModeNames.metro;
      break;
    case 'bicycle':
      result = legModeNames.bicycle;
      break;
    default:
      result = legModeNames.unknown;
  }

  return isDefinite ? result.definite : result;
}

export function getQuayName(
  quay?: Quay | Quay_v2 | QuayFragment,
): string | undefined {
  if (!quay) return;
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}
