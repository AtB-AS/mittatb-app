import {Quay as Quay_v2} from '../api/types/trips';
import {dictionary, TranslatedString} from '../translations';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {QuayFragment} from '@atb/api/types/generated/fragments/quays';
import {Quay} from '@atb/api/types/generated/journey_planner_v3_types';

export function getTranslatedModeName(
  mode?: AnyMode,
  subMode?: AnySubMode,
): TranslatedString {
  const legModeNames = dictionary.travel.legModes;
  const legSubModeNames = dictionary.travel.legSubModes;
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'nightBus') {
        return legSubModeNames.nightBus;
      }
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
    case 'metro':
      return legModeNames.metro;
    case 'bicycle':
      return legModeNames.bicycle;
    default:
      return legModeNames.unknown;
  }
}

export function getQuayName(
  quay?: Quay | Quay_v2 | QuayFragment,
): string | undefined {
  if (!quay) return;
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}
