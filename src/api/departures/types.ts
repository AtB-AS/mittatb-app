import {
  DestinationDisplay,
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {DeparturesQuery} from '../types/generated/DeparturesQuery';
import {CursoredData, CursoredQuery} from '@atb/sdk';
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

export type DepartureRealtimeQuery = {
  quayIds: string[];
  startTime: string;
  limit: number;
  limitPerLine?: number;
  lineIds?: string[];
  timeRange?: number;
};

export type DepartureFavoritesQuery = CursoredQuery<{
  startTime: string;
  limitPerLine: number;
  includeCancelledTrips?: boolean;
}>;

export type DepartureGroupMetadata = CursoredData<StopPlaceGroup[]>;
