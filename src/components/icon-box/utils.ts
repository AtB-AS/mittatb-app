import {ContrastColor, GeofencingZoneCode} from '@atb-as/theme';
import {AnyMode, AnySubMode} from './types';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  BusFill,
  CarFill,
  TramFill,
  TrainFill,
  BoatFill,
  FerryFill,
  WalkFill,
  NightFill,
  UnknownFill,
  BicycleFill,
  PlaneFill,
  ScooterFill,
  MetroFill,
} from '@atb/assets/svg/mono-icons/transportation';
import {Check} from '@atb/assets/svg/mono-icons/status';
import {Theme} from '@atb/theme';
import {NoParking} from '@atb/assets/svg/mono-icons/mobility';
import {Close} from '@atb/assets/svg/mono-icons/actions';

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
      if (subMode === TransportSubmode.NightBus) {
        return {svg: NightFill, name: 'Night Bus'};
      }
      return {svg: BusFill, name: 'Bus'};
    case 'tram':
      return {svg: TramFill, name: 'Tram'};
    case 'rail':
      return {svg: TrainFill, name: 'Train'};
    case 'air':
      return {svg: PlaneFill, name: 'Plane'};
    case 'water':
      return subMode && TRANSPORT_SUB_MODES_BOAT.includes(subMode)
        ? {svg: BoatFill, name: 'Boat'}
        : {svg: FerryFill, name: 'Ferry'};
    case 'foot':
      return {svg: WalkFill, name: 'Walk'};
    case 'metro':
      return {svg: MetroFill, name: 'Metro'};
    case 'car':
      return {svg: CarFill, name: 'Car'};
    case 'bicycle':
      return {svg: BicycleFill, name: 'Bicycle'};
    case 'scooter':
      return {svg: ScooterFill, name: 'Scooter'};
    case 'unknown':
    default:
      return {svg: UnknownFill, name: 'Unknown'};
  }
}

export const getGeofencingZoneCodeSvg = (code: GeofencingZoneCode) => {
  switch (code) {
    case 'allowed':
      return {svg: Check};
    case 'slow':
      return {svg: WalkFill};
    case 'noEntry':
      return {svg: Close};
    case 'noParking':
      return {svg: NoParking};
  }
};

export const getGeofencingZoneCodeIconColor = (
  code: GeofencingZoneCode,
  theme: Theme,
): ContrastColor => {
  switch (code) {
    case 'allowed':
      return theme.color.status.valid.primary;
    case 'slow':
      return theme.color.geofencingZone.slow.color;
    case 'noEntry':
      return theme.color.geofencingZone.noEntry.color;
    case 'noParking':
      return theme.color.geofencingZone.noParking.color;
  }
};

export const getIconBoxBorderRadius = (
  size: keyof Theme['icon']['size'],
  theme: Theme,
): number => {
  switch (size) {
    case 'xSmall':
    case 'small':
      return theme.border.radius.small;
    case 'normal':
    case 'large':
    default:
      return theme.border.radius.regular;
  }
};
