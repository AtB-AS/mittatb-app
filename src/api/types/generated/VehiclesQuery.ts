import * as Types from './mobility-types_v2';
import {
  VehicleBasicFragment,
  VehicleExtendedFragment,
  VehicleFragment,
} from './fragments/vehicles';

export type GetVehiclesBasicQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  formFactors?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.FormFactor>>
    | Types.InputMaybe<Types.FormFactor>
  >;
}>;
export type GetVehiclesExtendedQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  formFactors?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.FormFactor>>
    | Types.InputMaybe<Types.FormFactor>
  >;
}>;
export type GetVehiclesBasicQuery = {vehicles?: Array<VehicleBasicFragment>};

export type GetVehicleQueryVariables = Omit<
  GetVehiclesBasicQueryVariables,
  'range'
> & {
  id: Types.Scalars['String'];
  range?: Types.Scalars['Int'];
};
export type GetVehicleQuery = VehicleExtendedFragment | undefined;

export type GetVehiclesQueryVariables = GetVehiclesExtendedQueryVariables;
export type GetVehiclesQuery = Omit<GetVehiclesBasicQuery, 'vehicles'> & {
  vehicles?: Array<VehicleFragment>;
};
