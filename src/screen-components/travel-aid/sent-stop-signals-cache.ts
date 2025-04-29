import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import type {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';

type ServiceJourneyDepartureRelevantFields = Pick<
  ServiceJourneyDeparture,
  'serviceJourneyId' | 'fromStopPosition' | 'serviceDate'
>;

const addSentStopSignal =
  (sentStopSignals: ServiceJourneyDepartureRelevantFields[]) =>
  (departure: ServiceJourneyDepartureRelevantFields): void => {
    sentStopSignals.push(pickFields(departure));
  };

const hasSentStopSignal =
  (sentStopSignals: ServiceJourneyDepartureRelevantFields[]) =>
  (departure: ServiceJourneyDepartureRelevantFields): boolean =>
    sentStopSignals.some((sc) => isEqual(sc, pickFields(departure)));

const pickFields = (departure: ServiceJourneyDepartureRelevantFields) =>
  pick(departure, 'serviceJourneyId', 'fromStopPosition', 'serviceDate');

/**
 * An in-memory cache of sent stop signals. The sent stop signals are only
 * cached during the lifetime of the created cache instance.
 */
export const createSentStopSignalsCache = () => {
  const sentStopSignals: ServiceJourneyDepartureRelevantFields[] = [];
  return {
    addSent: addSentStopSignal(sentStopSignals),
    hasSent: hasSentStopSignal(sentStopSignals),
  };
};
