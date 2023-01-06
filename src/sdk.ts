import {
  Authority,
  BikeRentalStation,
  Coordinates,
  DestinationDisplay,
  Interchange,
  LegMode,
  Line,
  Notice,
  Operator,
  PointsOnLink,
  ReportType,
  ServiceJourney,
  StopPlace,
  StopPlaceDetails,
  TransportSubmode,
} from '@entur/sdk';
import {PointsOnLink as PointsOnLink_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import {Feature, LineString} from 'geojson';

export * from '@entur/sdk';

// @TODO This should come from Common lib.

export interface Place {
  latitude: number;
  longitude: number;
  name?: string;
  quay?: Quay;
  bikeRentalStation?: BikeRentalStation;
}

export interface Leg {
  aimedEndTime: string;
  aimedStartTime: string;
  authority?: Authority;
  distance: number;
  directDuration: number;
  duration: number;
  expectedEndTime: string;
  expectedStartTime: string;
  fromEstimatedCall?: EstimatedCall;
  fromPlace: Place;
  interchangeFrom?: Interchange;
  interchangeTo?: Interchange;
  intermediateEstimatedCalls: Array<IntermediateEstimatedCall>;
  line?: Line;
  mode: LegMode;
  notices?: Array<Notice>;
  operator?: Operator;
  pointsOnLink: PointsOnLink;
  realtime: boolean;
  ride: boolean;
  rentedBike?: boolean;
  serviceJourney: ServiceJourney;
  situations: Array<Situation>;
  toEstimatedCall?: EstimatedCall;
  toPlace: Place;
  transportSubmode: TransportSubmode;
}

export interface TripPattern {
  distance: number;
  directDuration: number;
  duration: number;
  endTime: string;
  id?: string;
  legs: Array<Leg>;
  startTime: string;
  walkDistance: number;
}

export interface EstimatedCall {
  actualArrivalTime?: string; // Only available AFTER arrival has taken place
  actualDepartureTime?: string; // Only available AFTER departure has taken place
  aimedArrivalTime: string;
  aimedDepartureTime: string;
  cancellation: boolean;
  date: string;
  destinationDisplay: DestinationDisplay;
  expectedArrivalTime: string;
  expectedDepartureTime: string;
  forAlighting: boolean;
  forBoarding: boolean;
  notices?: Array<Notice>;
  quay?: Quay;
  realtime: boolean;
  requestStop: boolean;
  serviceJourney: ServiceJourney;
  situations: Array<Situation>;
}
export type IntermediateEstimatedCall = EstimatedCall;

export type Departure = EstimatedCall;

export type Situation = {
  situationNumber?: string;
  reportType?: ReportType;
  summary: Array<{
    language?: string;
    value?: string;
  }>;
  description: Array<{
    language?: string;
    value?: string;
  }>;
  advice: Array<{
    language?: string;
    value?: string;
  }>;
  validityPeriod?: {
    startTime?: any;
    endTime?: any;
  };
  infoLinks?: Array<{uri?: string; label?: string}>;
};

export interface Quay {
  id: string;
  name: string;
  description: string;
  publicCode: string;
  situations: Array<Situation>;
  stopPlace: StopPlace;
}
export type QuayWithDepartures = {quay: Quay; departures: Array<Departure>};
export type DeparturesWithStop = {
  stop: StopPlaceDetails;
  quays: {
    [quayId: string]: QuayWithDepartures;
  };
};

export type ServiceJourneyWithDirection = ServiceJourney & {
  directionType: 'inbound' | 'outbound' | 'clockwise' | 'anticlockwise';
};

export type EstimatedCallWithDirection = EstimatedCall & {
  serviceJourney: ServiceJourneyWithDirection;
};

export type EstimatedQuay = Quay & {situations?: Situation[]} & {
  estimatedCalls: EstimatedCallWithDirection[];
};

export type StopPlaceDetailsWithEstimatedCalls = StopPlaceDetails & {
  quays?: EstimatedQuay[];
};

export type StopDepartures = {
  stopPlaces: StopPlaceDetailsWithEstimatedCalls[];
};

export type PaginationInput = {
  pageSize: number;
  pageOffset: number;
};

export type Paginated<T extends any[] | []> =
  | ({
      hasNext: true;
      nextPageOffset: number;

      data: T;
      totalResults: number;
    } & PaginationInput)
  | ({
      hasNext: false;

      data: T;
      totalResults: number;
    } & PaginationInput);

export type DeparturesMetadata = Paginated<DeparturesWithStop[]>;

export type RealtimeData = {
  serviceJourneyId: string;
  timeData: {
    realtime: boolean;
    expectedDepartureTime: string;
  };
};

export type DepartureRealtimeData = {
  quayId: string;
  departures: {[serviceJourneyId: string]: RealtimeData};
};

export type DeparturesRealtimeData = {
  [quayId: string]: DepartureRealtimeData;
};

export type NextCursorData = {
  nextCursor?: string;
  hasNextPage: boolean;
};

export type CursoredData<T> = {
  data: T;
  metadata:
    | {hasNextPage: false}
    | {
        hasNextPage: true;
        nextCursor: string;
        nextUrlParams: string;
      };
};

export type CursorInput = {
  cursor?: string;
  pageSize?: number;
};

export type CursoredQuery<T> = CursorInput & T;

export type MapLeg = {
  mode?: LegMode;
  faded?: boolean;
  transportSubmode?: TransportSubmode;
  pointsOnLink: PointsOnLink | PointsOnLink_v2;
};

export interface MapLine extends Feature<LineString> {
  travelType?: LegMode;
  subMode?: TransportSubmode;
  faded?: boolean;
}

export type ServiceJourneyMapInfoData = {
  mapLegs: MapLeg[];
  start?: Coordinates;
  stop?: Coordinates;
};
