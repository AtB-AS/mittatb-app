import * as TransportIcons from '@atb/assets/svg/mono-icons/transportation';
import * as EnturTransportIcons from '@atb/assets/svg/mono-icons/transportation-entur';
import {AnyMode, AnySubMode} from './types';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';

const TRANSPORT_SUB_MODES_BOAT: AnySubMode[] = [
  TransportSubmode.HighSpeedPassengerService,
  TransportSubmode.HighSpeedVehicleService,
  TransportSubmode.NationalPassengerFerry,
  TransportSubmode.LocalPassengerFerry,
  TransportSubmode.SightseeingService,
];

export function getTransportModeSvg(mode?: AnyMode, subMode?: AnySubMode) {
  switch (mode) {
    case 'bus':
    case 'coach':
      return TransportIcons.Bus;
    case 'tram':
      return TransportIcons.Tram;
    case 'rail':
      return TransportIcons.Train;
    case 'air':
      return EnturTransportIcons.Plane;
    case 'water':
      return subMode && TRANSPORT_SUB_MODES_BOAT.includes(subMode)
        ? TransportIcons.Boat
        : TransportIcons.Ferry;
    case 'foot':
      return TransportIcons.Walk;
    case 'metro':
      return EnturTransportIcons.Subway;
    default:
      return undefined;
  }
}
