import {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {Leg} from '@atb/api/types/trips';
import {getStopIdsFromEstimatedCalls, getStopIdsFromLegs} from '../utils';

describe('getStopIdsFromEstimatedCalls', () => {
  it('returns quay and stop place ids without duplicates', () => {
    const estimatedCalls = [
      {quay: {id: 'NSR:Quay:1', stopPlace: {id: 'NSR:StopPlace:1'}}},
      {quay: {id: 'NSR:Quay:2', stopPlace: {id: 'NSR:StopPlace:1'}}},
      {quay: {id: 'NSR:Quay:3'}},
    ] as unknown as EstimatedCallWithQuayFragment[];

    expect(getStopIdsFromEstimatedCalls(estimatedCalls)).toEqual([
      'NSR:Quay:1',
      'NSR:StopPlace:1',
      'NSR:Quay:2',
      'NSR:Quay:3',
    ]);
  });

  it('returns undefined when there are no estimated calls', () => {
    expect(getStopIdsFromEstimatedCalls(undefined)).toBeUndefined();
    expect(getStopIdsFromEstimatedCalls([])).toBeUndefined();
  });
});

describe('getStopIdsFromLegs', () => {
  it('returns ids for from, intermediate and to stops of all legs', () => {
    const legs = [
      {
        fromPlace: {},
        intermediateEstimatedCalls: [],
        toPlace: {
          quay: {id: 'NSR:Quay:1', stopPlace: {id: 'NSR:StopPlace:1'}},
        },
      },
      {
        fromPlace: {
          quay: {id: 'NSR:Quay:1', stopPlace: {id: 'NSR:StopPlace:1'}},
        },
        intermediateEstimatedCalls: [
          {quay: {id: 'NSR:Quay:2', stopPlace: {id: 'NSR:StopPlace:2'}}},
        ],
        toPlace: {
          quay: {id: 'NSR:Quay:3', stopPlace: {id: 'NSR:StopPlace:3'}},
        },
      },
    ] as unknown as Leg[];

    expect(getStopIdsFromLegs(legs)).toEqual([
      'NSR:Quay:1',
      'NSR:StopPlace:1',
      'NSR:Quay:2',
      'NSR:StopPlace:2',
      'NSR:Quay:3',
      'NSR:StopPlace:3',
    ]);
  });

  it('returns undefined when no legs have stops', () => {
    const legs = [
      {fromPlace: {}, intermediateEstimatedCalls: [], toPlace: {}},
    ] as unknown as Leg[];

    expect(getStopIdsFromLegs(legs)).toBeUndefined();
  });
});
