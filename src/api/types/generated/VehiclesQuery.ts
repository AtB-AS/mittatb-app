import * as Types from './mobility-types_v2';
import {
  VehicleBasicFragment,
  VehicleExtendedFragment,
} from './fragments/mobility-shared';

export type GetVehiclesQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  includeBicycles: Types.Scalars['Boolean'];
  bicycleOperators?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['String']>>
    | Types.InputMaybe<Types.Scalars['String']>
  >;
  includeScooters: Types.Scalars['Boolean'];
  scooterOperators?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['String']>>
    | Types.InputMaybe<Types.Scalars['String']>
  >;
}>;

export type GetVehiclesQuery = {
  bicycles?: Array<VehicleBasicFragment>;
  scooters?: Array<VehicleBasicFragment>;
};

export type GetVehicleQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<
    Array<Types.Scalars['String']> | Types.Scalars['String']
  >;
}>;

export type GetVehicleQuery = {vehicles?: Array<VehicleExtendedFragment>};
