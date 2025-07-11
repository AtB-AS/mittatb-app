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
