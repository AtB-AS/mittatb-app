import * as Types from './generated/StopQuayDeparturesQuery';

export type StopPlaceQuayDepartures = Types.StopPlaceQuayDeparturesQuery;

type StopPlace = Required<
  Required<Types.StopPlaceQuayDeparturesQuery>['stopPlace']
>;
export type Quay = Required<StopPlace['quays']>[0];
export type EstimatedCall = Quay['estimatedCalls'][0];
