import {AnyMode, AnySubMode} from './types';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  Bus,
  Flexible,
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
      return Flexible;
    case 'bus':
    case 'coach':
      return Bus;
    case 'tram':
      return Tram;
    case 'rail':
      return Train;
    case 'air':
      return Plane;
    case 'water':
      return subMode && TRANSPORT_SUB_MODES_BOAT.includes(subMode)
        ? Boat
        : Ferry;
    case 'foot':
      return Walk;
    case 'metro':
      return Subway;
    case 'unknown':
    default:
      return Unknown;
  }
}
