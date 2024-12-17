import * as Types from './mobility-types_v2';
import {
  BikeStationFragment,
  CarStationFragment,
} from '@atb/api/types/generated/fragments/stations';

export type GetCarStationQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<
    Array<Types.Scalars['String']> | Types.Scalars['String']
  >;
}>;

export type GetCarStationQuery = {stations?: Array<CarStationFragment>};

export type GetBikeStationQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<
    Array<Types.Scalars['String']> | Types.Scalars['String']
  >;
}>;

export type GetBikeStationQuery = {stations?: Array<BikeStationFragment>};
