import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import type {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';

const sentStopSignals: Pick<
  ServiceJourneyDeparture,
  'serviceJourneyId' | 'fromQuayId' | 'serviceDate'
>[] = [];

const addSentStopSignal = (departure: ServiceJourneyDeparture): void => {
  sentStopSignals.push(pickFields(departure));
};

const hasSentStopSignal = (departure: ServiceJourneyDeparture): boolean =>
  sentStopSignals.some((sc) => isEqual(sc, pickFields(departure)));

const pickFields = (departure: ServiceJourneyDeparture) =>
  pick(departure, 'serviceJourneyId', 'fromQuayId', 'serviceDate');

/**
 * An in-memory cache of sent stop signals. The cache will be cleared at app
 * restart.
 */
export const sentStopSignalsCache = {
  addSent: addSentStopSignal,
  hasSent: hasSentStopSignal,
};
