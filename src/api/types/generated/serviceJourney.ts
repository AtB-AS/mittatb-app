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
      forBoarding: boolean;
      predictionInaccurate: boolean;
      realtime: boolean;
      requestStop: boolean;
      destinationDisplay?: {frontText?: string};
      notices: Array<{text?: string}>;
      quay?: {
        id: string;
        name: string;
        description?: string;
        publicCode?: string;
        situations: Array<{
          situationNumber?: string;
          reportType?: Types.ReportType;
          summary: Array<{language?: string; value: string}>;
          description: Array<{language?: string; value: string}>;
          advice: Array<{language?: string; value: string}>;
          lines: Array<{
            description?: string;
            flexibleLineType?: string;
            id: string;
            name?: string;
            publicCode?: string;
            transportMode?: Types.TransportMode;
            transportSubmode?: Types.TransportSubmode;
            notices: Array<{text?: string}>;
          }>;
          validityPeriod?: {startTime?: any; endTime?: any};
          infoLinks?: Array<{uri: string; label?: string}>;
        }>;
        stopPlace?: {
          id: string;
          description?: string;
          name: string;
          latitude?: number;
          longitude?: number;
          tariffZones: Array<{id: string}>;
        };
      };
      serviceJourney?: {
        id: string;
        publicCode?: string;
        privateCode?: string;
        transportSubmode?: Types.TransportSubmode;
        journeyPattern?: {
          line: {
            description?: string;
            flexibleLineType?: string;
            id: string;
            name?: string;
            publicCode?: string;
            transportMode?: Types.TransportMode;
            transportSubmode?: Types.TransportSubmode;
            notices: Array<{text?: string}>;
          };
          notices: Array<{text?: string}>;
        };
        notices: Array<{text?: string}>;
      };
      situations: Array<{
        situationNumber?: string;
        reportType?: Types.ReportType;
        summary: Array<{language?: string; value: string}>;
        description: Array<{language?: string; value: string}>;
        advice: Array<{language?: string; value: string}>;
        lines: Array<{
          description?: string;
          flexibleLineType?: string;
          id: string;
          name?: string;
          publicCode?: string;
          transportMode?: Types.TransportMode;
          transportSubmode?: Types.TransportSubmode;
          notices: Array<{text?: string}>;
        }>;
        validityPeriod?: {startTime?: any; endTime?: any};
        infoLinks?: Array<{uri: string; label?: string}>;
      }>;
    }>;
  };
};

export type EstimatedCallFieldsFragment = {
  actualArrivalTime?: any;
  actualDepartureTime?: any;
  aimedArrivalTime: any;
  aimedDepartureTime: any;
  cancellation: boolean;
  date?: any;
  expectedDepartureTime: any;
  expectedArrivalTime: any;
  forAlighting: boolean;
  forBoarding: boolean;
  predictionInaccurate: boolean;
  realtime: boolean;
  requestStop: boolean;
  destinationDisplay?: {frontText?: string};
  notices: Array<{text?: string}>;
  quay?: {
    id: string;
    name: string;
    description?: string;
    publicCode?: string;
    situations: Array<{
      situationNumber?: string;
      reportType?: Types.ReportType;
      summary: Array<{language?: string; value: string}>;
      description: Array<{language?: string; value: string}>;
      advice: Array<{language?: string; value: string}>;
      lines: Array<{
        description?: string;
        flexibleLineType?: string;
        id: string;
        name?: string;
        publicCode?: string;
        transportMode?: Types.TransportMode;
        transportSubmode?: Types.TransportSubmode;
        notices: Array<{text?: string}>;
      }>;
      validityPeriod?: {startTime?: any; endTime?: any};
      infoLinks?: Array<{uri: string; label?: string}>;
    }>;
    stopPlace?: {
      id: string;
      description?: string;
      name: string;
      latitude?: number;
      longitude?: number;
      tariffZones: Array<{id: string}>;
    };
  };
  serviceJourney?: {
    id: string;
    publicCode?: string;
    privateCode?: string;
    transportSubmode?: Types.TransportSubmode;
    journeyPattern?: {
      line: {
        description?: string;
        flexibleLineType?: string;
        id: string;
        name?: string;
        publicCode?: string;
        transportMode?: Types.TransportMode;
        transportSubmode?: Types.TransportSubmode;
        notices: Array<{text?: string}>;
      };
      notices: Array<{text?: string}>;
    };
    notices: Array<{text?: string}>;
  };
  situations: Array<{
    situationNumber?: string;
    reportType?: Types.ReportType;
    summary: Array<{language?: string; value: string}>;
    description: Array<{language?: string; value: string}>;
    advice: Array<{language?: string; value: string}>;
    lines: Array<{
      description?: string;
      flexibleLineType?: string;
      id: string;
      name?: string;
      publicCode?: string;
      transportMode?: Types.TransportMode;
      transportSubmode?: Types.TransportSubmode;
      notices: Array<{text?: string}>;
    }>;
    validityPeriod?: {startTime?: any; endTime?: any};
    infoLinks?: Array<{uri: string; label?: string}>;
  }>;
};

export type NoticeFieldsFragment = {text?: string};

export type QuayFieldsFragment = {
  id: string;
  name: string;
  description?: string;
  publicCode?: string;
  situations: Array<{
    situationNumber?: string;
    reportType?: Types.ReportType;
    summary: Array<{language?: string; value: string}>;
    description: Array<{language?: string; value: string}>;
    advice: Array<{language?: string; value: string}>;
    lines: Array<{
      description?: string;
      flexibleLineType?: string;
      id: string;
      name?: string;
      publicCode?: string;
      transportMode?: Types.TransportMode;
      transportSubmode?: Types.TransportSubmode;
      notices: Array<{text?: string}>;
    }>;
    validityPeriod?: {startTime?: any; endTime?: any};
    infoLinks?: Array<{uri: string; label?: string}>;
  }>;
  stopPlace?: {
    id: string;
    description?: string;
    name: string;
    latitude?: number;
    longitude?: number;
    tariffZones: Array<{id: string}>;
  };
};

export type SituationFieldsFragment = {
  situationNumber?: string;
  reportType?: Types.ReportType;
  summary: Array<{language?: string; value: string}>;
  description: Array<{language?: string; value: string}>;
  advice: Array<{language?: string; value: string}>;
  lines: Array<{
    description?: string;
    flexibleLineType?: string;
    id: string;
    name?: string;
    publicCode?: string;
    transportMode?: Types.TransportMode;
    transportSubmode?: Types.TransportSubmode;
    notices: Array<{text?: string}>;
  }>;
  validityPeriod?: {startTime?: any; endTime?: any};
  infoLinks?: Array<{uri: string; label?: string}>;
};

export type LineFieldsFragment = {
  description?: string;
  flexibleLineType?: string;
  id: string;
  name?: string;
  publicCode?: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
  notices: Array<{text?: string}>;
};

export type StopPlaceFieldsFragment = {
  id: string;
  description?: string;
  name: string;
  latitude?: number;
  longitude?: number;
  tariffZones: Array<{id: string}>;
};

export type ServiceJourneyFieldsFragment = {
  id: string;
  publicCode?: string;
  privateCode?: string;
  transportSubmode?: Types.TransportSubmode;
  journeyPattern?: {
    line: {
      description?: string;
      flexibleLineType?: string;
      id: string;
      name?: string;
      publicCode?: string;
      transportMode?: Types.TransportMode;
      transportSubmode?: Types.TransportSubmode;
      notices: Array<{text?: string}>;
    };
    notices: Array<{text?: string}>;
  };
  notices: Array<{text?: string}>;
};
