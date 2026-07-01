import {EstimatedCall} from '@atb/api/types/departures';
import {DeparturesRealtimeData} from '@atb/api/bff/departures';
import {
  getDeparturesAugmentedWithRealtimeData,
  sortEstimatedCallsByExpectedTime,
} from './utils';

const call = (
  id: string,
  expectedDepartureTime: string,
  serviceJourneyId = `sj-${id}`,
  quayId = 'quay-1',
): EstimatedCall =>
  ({
    expectedDepartureTime,
    aimedDepartureTime: expectedDepartureTime,
    serviceJourney: {id: serviceJourneyId},
    quay: {id: quayId},
  }) as unknown as EstimatedCall;

const realtime = (
  serviceJourneyId: string,
  expectedDepartureTime: string,
  quayId = 'quay-1',
): DeparturesRealtimeData => ({
  [quayId]: {
    quayId,
    departures: {
      [serviceJourneyId]: {
        serviceJourneyId,
        timeData: {
          realtime: true,
          expectedDepartureTime,
          aimedDepartureTime: expectedDepartureTime,
        },
      },
    },
  },
});

describe('sortEstimatedCallsByExpectedTime', () => {
  it('sorts ascending by expectedDepartureTime', () => {
    const result = sortEstimatedCallsByExpectedTime([
      call('a', '2024-01-01T07:05:00Z'),
      call('b', '2024-01-01T07:03:00Z'),
      call('c', '2024-01-01T07:08:00Z'),
    ]);

    expect(result.map((c) => c.expectedDepartureTime)).toEqual([
      '2024-01-01T07:03:00Z',
      '2024-01-01T07:05:00Z',
      '2024-01-01T07:08:00Z',
    ]);
  });

  it('does not mutate the input array', () => {
    const input = [
      call('a', '2024-01-01T07:05:00Z'),
      call('b', '2024-01-01T07:03:00Z'),
    ];
    sortEstimatedCallsByExpectedTime(input);

    expect(input.map((c) => c.expectedDepartureTime)).toEqual([
      '2024-01-01T07:05:00Z',
      '2024-01-01T07:03:00Z',
    ]);
  });
});

describe('getDeparturesAugmentedWithRealtimeData', () => {
  it('returns [] when estimatedCalls is undefined', () => {
    expect(getDeparturesAugmentedWithRealtimeData(undefined, {})).toEqual([]);
  });

  it('returns estimatedCalls unchanged when no realtime data', () => {
    const calls = [call('a', '2024-01-01T07:05:00Z')];
    expect(getDeparturesAugmentedWithRealtimeData(calls, undefined)).toBe(
      calls,
    );
  });

  it('updates expectedDepartureTime from realtime data', () => {
    const result = getDeparturesAugmentedWithRealtimeData(
      [call('a', '2024-01-01T07:05:00Z', 'sj-a')],
      realtime('sj-a', '2024-01-01T07:01:00Z'),
    );

    expect(result[0].expectedDepartureTime).toBe('2024-01-01T07:01:00Z');
    expect(result[0].realtime).toBe(true);
  });

  it('re-sorts when a realtime update makes one departure overtake another', () => {
    const result = getDeparturesAugmentedWithRealtimeData(
      [
        call('a', '2024-01-01T07:02:00Z', 'sj-a'),
        call('b', '2024-01-01T07:04:00Z', 'sj-b'),
      ],
      realtime('sj-a', '2024-01-01T07:06:00Z'),
    );

    expect(result.map((c) => c.serviceJourney.id)).toEqual(['sj-b', 'sj-a']);
  });
});
