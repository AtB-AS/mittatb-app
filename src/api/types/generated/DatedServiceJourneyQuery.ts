import type {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

export type DatedServiceJourneyQuery = {
  datedServiceJourney?: {
    id: string;
    estimatedCalls: Array<{
      expectedDepartureTime: any;
      expectedArrivalTime: any;
      quay: {stopPlace?: {id: string; name: string}};
    }>;
    serviceJourney: {
      transportMode?: TransportMode;
      transportSubmode?: TransportSubmode;
      line: {publicCode?: string; name?: string};
    };
  };
};
