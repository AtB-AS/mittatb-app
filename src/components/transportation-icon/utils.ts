import * as TransportIcons from '@atb/assets/svg/mono-icons/transportation';
import * as EnturTransportIcons from '@atb/assets/svg/mono-icons/transportation-entur';
import {AnyMode} from './TransportationIcon';

export function getTransportModeSvg(mode?: AnyMode) {
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
      return TransportIcons.Boat;
    case 'foot':
      return TransportIcons.Walk;
    case 'metro':
      return EnturTransportIcons.Subway;
    default:
      return null;
  }
}
