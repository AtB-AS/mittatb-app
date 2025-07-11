import {
  DestinationDisplay,
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {DeparturesQuery} from '../types/generated/DeparturesQuery';
import {CursoredData} from '@atb/sdk';
import {BookingArrangementFragment} from '@atb/api/types/generated/fragments/booking-arrangements';

type Notice = {text?: string};

export type DepartureLineInfo = {
  /** @deprecated Use destinationDisplay instead */
  lineName?: string;
  destinationDisplay: DestinationDisplay;
  lineNumber: string;
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  quayId: string;
  notices: Notice[];
  lineId: string;
};

export type EstimatedCallWithLineName =
  DeparturesQuery['quays'][0]['estimatedCalls'][0] & {
    lineName?: string;
  };
export type DeparturesWithLineName = DeparturesQuery & {
  quays: (DeparturesQuery['quays'][0] & {
    estimatedCalls: EstimatedCallWithLineName[];
  })[];
};

export type DepartureTime = {
  time: string;
  aimedTime: string;
  realtime?: boolean;
  predictionInaccurate?: boolean;
  situations: SituationFragment[];
  serviceJourneyId?: string;
  serviceDate: string;
  notices?: NoticeFragment[];
  cancellation?: boolean;
  bookingArrangements?: BookingArrangementFragment;
  stopPositionInPattern: number;
};

export type DepartureGroup = {
  lineInfo?: DepartureLineInfo;
  departures: DepartureTime[];
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
  situations: SituationFragment[];
};

export type QuayGroup = {
  quay: QuayInfo;
  group: DepartureGroup[];
};

export type StopPlaceGroup = {
  stopPlace: StopPlaceInfo;
  quays: QuayGroup[];
};

export type DepartureGroupMetadata = CursoredData<StopPlaceGroup[]>;

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
