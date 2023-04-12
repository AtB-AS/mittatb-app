import * as Types from '@atb/api/types/generated/vehicles-types_v1';

export type GetServiceJourneyVehicleQuery = {
  vehicles?: Array<{
    lastUpdated?: any;
    bearing?: number;
    mode?: Types.VehicleModeEnumeration;
    location?: {latitude: number; longitude: number};
    serviceJourney?: {id: string};
  }>;
};

export type GetServiceJourneyVehicles = Required<
  Required<GetServiceJourneyVehicleQuery>['vehicles']
>;

export type VehiclePosition = GetServiceJourneyVehicles[0];
