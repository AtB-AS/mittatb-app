import {
  Departure,
  Quay,
  StopPlaceDetails,
  ServiceJourney,
  EstimatedCall,
  Situation,
} from '@entur/sdk';

export * from '@entur/sdk';

export type QuayWithDepartures = {quay: Quay; departures: Array<Departure>};
export type DeparturesWithStop = {
  stop: StopPlaceDetails;
  quays: {
    [quayId: string]: QuayWithDepartures;
  };
};

// @TODO This should come from Common lib

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
