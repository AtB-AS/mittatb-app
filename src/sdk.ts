import {
  Authority,
  Departure,
  EstimatedCall,
  InfoLink,
  Interchange,
  IntermediateEstimatedCall,
  LegMode,
  Line,
  MultilingualString,
  Notice,
  Operator,
  Place,
  PointsOnLink,
  ReportType,
  ServiceJourney,
  StopPlace,
  StopPlaceDetails,
  TransportSubmode,
  ValidityPeriod,
} from '@entur/sdk';

export * from '@entur/sdk';

// @TODO This should come from Common lib

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

export interface Situation {
  situationNumber: string;
  summary: Array<MultilingualString>;
  description: Array<MultilingualString>;
  advice: Array<MultilingualString>;
  lines: Array<Line>;
  validityPeriod: ValidityPeriod;
  reportType: ReportType;
  infoLinks: Array<InfoLink>;
}

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
    expectedArrivalTime: string;
    expectedDepartureTime: string;
    actualArrivalTime: string;
    actualDepartureTime: string;
    aimedArrivalTime: string;
    aimedDepartureTime: string;
  };
};

export type DepartureRealtimeData = {
  quayId: string;
  departures: {[serviceJourneyId: string]: RealtimeData};
};

export type DeparturesRealtimeData = {
  [quayId: string]: DepartureRealtimeData;
};
