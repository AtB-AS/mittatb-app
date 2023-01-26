import * as Types from './mobility-types_v2';
import {VehicleFragment} from './fragments/vehicles';

export type GetVehiclesQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  formFactors?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.FormFactor>>
    | Types.InputMaybe<Types.FormFactor>
  >;
}>;

export type GetVehiclesQuery = {vehicles?: Array<VehicleFragment>};
