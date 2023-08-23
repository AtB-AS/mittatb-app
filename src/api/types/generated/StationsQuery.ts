import * as Types from './mobility-types_v2';
import {
  BikeStationFragment,
  CarStationFragment,
  StationBasicFragment,
} from '@atb/api/types/generated/fragments/stations';

export type GetStationsQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  includeBicycles: Types.Scalars['Boolean'];
  bicycleOperators?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['String']>>
    | Types.InputMaybe<Types.Scalars['String']>
  >;
  includeCars: Types.Scalars['Boolean'];
  carOperators?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['String']>>
    | Types.InputMaybe<Types.Scalars['String']>
  >;
}>;

export type GetStationsQuery = {
  bicycles?: Array<StationBasicFragment>;
  cars?: Array<StationBasicFragment>;
};

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
