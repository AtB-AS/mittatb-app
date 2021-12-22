import * as Types from './generated/StopQuayDeparturesQuery';
import {NearestStopPlacesQuery} from './generated/NearestStopPlacesQuery';

export type StopPlaceQuayDepartures = Types.StopPlaceQuayDeparturesQuery;

type StopPlace = Required<
  Required<Types.StopPlaceQuayDeparturesQuery>['stopPlace']
>;
export type EstimatedCall = Required<
  StopPlace['quays']
>[0]['estimatedCalls'][0];

export type StopPlacePosition = Required<
  Required<Required<NearestStopPlacesQuery>['nearest']>['edges']
>[0];

export type Quay = Required<
  Required<Required<StopPlacePosition>['node']>['place']
>['quays'][0];
