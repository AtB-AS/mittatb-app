import {Departure, Quay, StopPlaceDetails} from '@entur/sdk';

export * from '@entur/sdk';

export type DeparturesWithStop = {
  stop: StopPlaceDetails;
  quays: {
    [quayId: string]: {quay: Quay; departures: Array<Departure>};
  };
};
