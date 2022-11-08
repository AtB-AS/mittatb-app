import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type ServiceJourneyDeparturesQuery = {
  serviceJourney?: {
    estimatedCalls?: Array<{
      actualArrivalTime?: any;
      actualDepartureTime?: any;
      aimedArrivalTime: any;
      aimedDepartureTime: any;
      cancellation: boolean;
      date?: any;
      expectedDepartureTime: any;
      expectedArrivalTime: any;
      forAlighting: boolean;
      realtime: boolean;
      destinationDisplay?: {frontText?: string};
      notices: Array<{text?: string}>;
      quay?: {
        id: string;
        name: string;
        publicCode?: string;
        situations: Array<{
          situationNumber?: string;
          reportType?: Types.ReportType;
          summary: Array<{language?: string; value: string}>;
          description: Array<{language?: string; value: string}>;
          advice: Array<{language?: string; value: string}>;
          infoLinks?: Array<{uri: string; label?: string}>;
        }>;
        stopPlace?: {
          id: string;
          name: string;
          latitude?: number;
          longitude?: number;
        };
      };
      serviceJourney?: {
        id: string;
        journeyPattern?: {
          line: {
            id: string;
            name?: string;
            publicCode?: string;
            transportMode?: Types.TransportMode;
            transportSubmode?: Types.TransportSubmode;
          };
        };
      };
      situations: Array<{
        situationNumber?: string;
        reportType?: Types.ReportType;
        summary: Array<{language?: string; value: string}>;
        description: Array<{language?: string; value: string}>;
        advice: Array<{language?: string; value: string}>;
        infoLinks?: Array<{uri: string; label?: string}>;
      }>;
    }>;
  };
};

export type ServiceJourneyEstimatedCallFragment = {
  actualArrivalTime?: any;
  actualDepartureTime?: any;
  aimedArrivalTime: any;
  aimedDepartureTime: any;
  cancellation: boolean;
  date?: any;
  expectedDepartureTime: any;
  expectedArrivalTime: any;
  forAlighting: boolean;
  realtime: boolean;
  destinationDisplay?: {frontText?: string};
  notices: Array<{text?: string}>;
  quay?: {
    id: string;
    name: string;
    publicCode?: string;
    situations: Array<{
      situationNumber?: string;
      reportType?: Types.ReportType;
      summary: Array<{language?: string; value: string}>;
      description: Array<{language?: string; value: string}>;
      advice: Array<{language?: string; value: string}>;
      infoLinks?: Array<{uri: string; label?: string}>;
    }>;
    stopPlace?: {
      id: string;
      name: string;
      latitude?: number;
      longitude?: number;
    };
  };
  serviceJourney?: {
    id: string;
    journeyPattern?: {
      line: {
        id: string;
        name?: string;
        publicCode?: string;
        transportMode?: Types.TransportMode;
        transportSubmode?: Types.TransportSubmode;
      };
    };
  };
  situations: Array<{
    situationNumber?: string;
    reportType?: Types.ReportType;
    summary: Array<{language?: string; value: string}>;
    description: Array<{language?: string; value: string}>;
    advice: Array<{language?: string; value: string}>;
    infoLinks?: Array<{uri: string; label?: string}>;
  }>;
};

export type NoticeFragment = {text?: string};

export type QuayFragment = {
  id: string;
  name: string;
  publicCode?: string;
  situations: Array<{
    situationNumber?: string;
    reportType?: Types.ReportType;
    summary: Array<{language?: string; value: string}>;
    description: Array<{language?: string; value: string}>;
    advice: Array<{language?: string; value: string}>;
    infoLinks?: Array<{uri: string; label?: string}>;
  }>;
  stopPlace?: {id: string; name: string; latitude?: number; longitude?: number};
};

export type SituationFragment = {
  situationNumber?: string;
  reportType?: Types.ReportType;
  summary: Array<{language?: string; value: string}>;
  description: Array<{language?: string; value: string}>;
  advice: Array<{language?: string; value: string}>;
  infoLinks?: Array<{uri: string; label?: string}>;
};

export type LineFragment = {
  id: string;
  name?: string;
  publicCode?: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
};

export type StopPlaceFragment = {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
};

export type ServiceJourneyFragment = {
  id: string;
  journeyPattern?: {
    line: {
      id: string;
      name?: string;
      publicCode?: string;
      transportMode?: Types.TransportMode;
      transportSubmode?: Types.TransportSubmode;
    };
  };
};
