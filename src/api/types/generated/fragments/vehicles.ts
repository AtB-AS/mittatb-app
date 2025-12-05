import * as Types from '../vehicles-types_v2';

export type VehicleFragment = {
  mode?: Types.VehicleModeEnumeration;
  lastUpdated?: any;
  vehicleStatus?: Types.VehicleStatusEnumeration;
  bearing?: number;
  serviceJourney?: {id: string};
  location?: {latitude: number; longitude: number};
  progressBetweenStops?: {percentage?: number; linkDistance?: number};
  monitoredCall?: {stopPointRef?: string; vehicleAtStop?: boolean};
};
