import * as Types from './mobility-types_v2';
import {StationFragment} from '@atb/api/types/generated/fragments/stations';

export type GetStationsQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  availableFormFactors?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.FormFactor>>
    | Types.InputMaybe<Types.FormFactor>
  >;
}>;
export type GetStationsQuery = {stations?: Array<StationFragment>};
