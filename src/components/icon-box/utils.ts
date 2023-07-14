import {AnyMode, AnySubMode} from './types';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  Bus,
  Tram,
  Train,
  Boat,
  Ferry,
  Walk,
  Unknown,
} from '@atb/assets/svg/mono-icons/transportation';
import {Plane, Subway} from '@atb/assets/svg/mono-icons/transportation-entur';

const TRANSPORT_SUB_MODES_BOAT: AnySubMode[] = [
  TransportSubmode.HighSpeedPassengerService,
  TransportSubmode.HighSpeedVehicleService,
  TransportSubmode.NationalPassengerFerry,
  TransportSubmode.LocalPassengerFerry,
  TransportSubmode.SightseeingService,
];

export function getTransportModeSvg(mode?: AnyMode, subMode?: AnySubMode) {
  switch (mode) {
    case 'flex':
      return {svg: Bus, name: 'Flexible'};
    case 'bus':
    case 'coach':
      return {svg: Bus, name: 'Bus'};
    case 'tram':
      return {svg: Tram, name: 'Tram'};
    case 'rail':
      return {svg: Train, name: 'Train'};
    case 'air':
      return {svg: Plane, name: 'Plane'};
    case 'water':
      return subMode && TRANSPORT_SUB_MODES_BOAT.includes(subMode)
        ? {svg: Boat, name: 'Boat'}
        : {svg: Ferry, name: 'Ferry'};
    case 'foot':
      return {svg: Walk, name: 'Walk'};
    case 'metro':
      return {svg: Subway, name: 'Subway'};
    case 'unknown':
    default:
      return {svg: Unknown, name: 'Unknown'};
  }
}
