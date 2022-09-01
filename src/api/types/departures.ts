import * as Types from './generated/StopQuayDeparturesQuery';
import {NearestStopPlacesQuery} from './generated/NearestStopPlacesQuery';
import {
  Notice,
  PtSituationElement,
  TransportMode,
  TransportSubmode,
} from './generated/journey_planner_v3_types';

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

export type Place = Required<Required<StopPlacePosition>['node']>['place'];

export type Quay = Required<Place>['quays'][0];

export type FavouriteAPIParam = {
  quayId: string;
  lineId: string;
  lineName: string | undefined;
};

export type FavouriteDepartureAPIParam = {
  quayId: string;
  lineId: string;
  lineName: string;
};

export type FavouriteResponse = {};

export type DepartureLineInfo = {
  lineName: string;
  lineNumber: string;
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  quayId: string;
  notices: Notice[];
  lineId: string;
  lineVariationIdentifier?: string;
};

export type DepartureTime = {
  time: string;
  aimedTime: string;
  realtime?: boolean;
  predictionInaccurate?: boolean;
  situations?: PtSituationElement[];
  serviceJourneyId?: string;
  serviceDate: string;
};

export type StopPlaceInfo = {
  id: string;
  description?: string | undefined;
  name: string;
  latitude?: number | undefined;
  longitude?: number | undefined;
};

export type QuayInfo = {
  id: string;
  name: string;
  description?: string | undefined;
  publicCode?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  situations?: PtSituationElement[];
  stopPlaceId?: string;
};

export type StopPlaceGroup = {
  stopPlace: StopPlaceInfo;
  quays: QuayGroup[];
};

export type QuayGroup = {
  quay: QuayInfo;
  group: DepartureGroup[];
};

export type DepartureGroup = {
  lineInfo?: DepartureLineInfo;
  departures: DepartureTime[];
};
