export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type RealtimeData = {
  serviceJourneyId: string;
  timeData: {
    realtime: boolean;
    expectedDepartureTime: string;
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

export enum FeatureCategory {
  ONSTREET_BUS = 'onstreetBus',
  ONSTREET_TRAM = 'onstreetTram',
  AIRPORT = 'airport',
  RAIL_STATION = 'railStation',
  METRO_STATION = 'metroStation',
  BUS_STATION = 'busStation',
  COACH_STATION = 'coachStation',
  TRAM_STATION = 'tramStation',
  HARBOUR_PORT = 'harbourPort',
  FERRY_PORT = 'ferryPort',
  FERRY_STOP = 'ferryStop',
  LIFT_STATION = 'liftStation',
  VEHICLE_RAIL_INTERCHANGE = 'vehicleRailInterchange',
  GROUP_OF_STOP_PLACES = 'GroupOfStopPlaces',
  POI = 'poi',
  VEGADRESSE = 'Vegadresse',
  STREET = 'street',
  TETTSTEDDEL = 'tettsteddel',
  BYDEL = 'bydel',
  OTHER = 'other',
}

export type Feature = {
  geometry: {
    coordinates: [number, number];
    type: 'Point';
  };
  properties: {
    id: string;
    name: string;
    label?: string;
    borough: string;
    accuracy: 'point';
    layer: 'venue' | 'address';
    borough_gid: string;
    category: FeatureCategory[];
    country_gid: string;
    county: string;
    county_gid: string;
    gid: string;
    housenumber?: string;
    locality: string;
    locality_gid: string;
    postalcode: string;
    source: string;
    source_id: string;
    street: string;
    tariff_zones?: string[];
  };
};
