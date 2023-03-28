import * as Types from '@atb/api/types/generated/vehicles-types_v1';

type GetServiceJourneyVehiclesQuery = {
  vehicles?: Array<{
    lastUpdated?: any;
    bearing?: number;
    mode?: Types.VehicleModeEnumeration;
    location?: {latitude: number; longitude: number};
    serviceJourney?: {id: string};
  }>;
};

export type GetServiceJourneyVehicles = Required<
  Required<GetServiceJourneyVehiclesQuery>['vehicles']
>;

export type VehiclePosition = GetServiceJourneyVehicles[0];
