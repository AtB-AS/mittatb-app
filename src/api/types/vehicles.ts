import {GetServiceJourneyVehicleQuery} from './generated/ServiceJourneyVehiclesQuery';

export type GetServiceJourneyVehicles = Required<
  Required<GetServiceJourneyVehicleQuery>['vehicles']
>;

export type VehicleWithPosition = GetServiceJourneyVehicles[0];
