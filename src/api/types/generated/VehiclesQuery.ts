import * as Types from './mobility-types_v2';
import {VehicleExtendedFragment} from './fragments/vehicles';

export type GetVehicleQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<
    Array<Types.Scalars['String']> | Types.Scalars['String']
  >;
}>;

export type GetVehicleQuery = {vehicles?: Array<VehicleExtendedFragment>};
