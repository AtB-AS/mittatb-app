import * as Types from '@atb/api/types/generated/vehicles-types_v1';

export type GetServiceJourneyVehicleQuery = {
  vehicles?: Array<{
    lastUpdated?: any;
    bearing?: number;
    mode?: Types.VehicleModeEnumeration;
    vehicleStatus?: Types.VehicleStatusEnumeration;
    location?: {latitude: number; longitude: number};
    serviceJourney?: {id: string};
    progressBetweenStops?: {percentage?: number; linkDistance?: number};
    monitoredCall?: {stopPointRef?: string; vehicleAtStop?: boolean};
  }>;
};
