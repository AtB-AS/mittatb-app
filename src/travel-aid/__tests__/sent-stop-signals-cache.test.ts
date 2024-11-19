import {createSentStopSignalsCache} from '@atb/travel-aid/sent-stop-signals-cache';

describe('sentStopSignalsCache', () => {
  let sentStopSignalsCache: ReturnType<typeof createSentStopSignalsCache>;

  beforeEach(() => {
    sentStopSignalsCache = createSentStopSignalsCache();
  });

  it('hasSent is true if existing entry with all fields equal', () => {
    const testInput = {
      serviceJourneyId: 's1',
      fromQuayId: 'q1',
      serviceDate: '2025-01-01',
    };

    sentStopSignalsCache.addSent(testInput);
    expect(sentStopSignalsCache.hasSent(testInput)).toBe(true);
    expect(sentStopSignalsCache.hasSent({...testInput})).toBe(true);

    sentStopSignalsCache.addSent({...testInput, serviceJourneyId: 'id2'});
    expect(sentStopSignalsCache.hasSent(testInput)).toBe(true);
    expect(sentStopSignalsCache.hasSent({...testInput})).toBe(true);
  });

  it('hasSent is false if no existing entry with all fields equal', () => {
    const testInput = {
      serviceJourneyId: 's1',
      fromQuayId: 'q1',
      serviceDate: '2025-01-01',
    };

    expect(sentStopSignalsCache.hasSent(testInput)).toBe(false);

    sentStopSignalsCache.addSent(testInput);

    expect(
      sentStopSignalsCache.hasSent({...testInput, serviceDate: 's2'}),
    ).toBe(false);

    expect(sentStopSignalsCache.hasSent({...testInput, fromQuayId: 'q2'})).toBe(
      false,
    );

    expect(
      sentStopSignalsCache.hasSent({...testInput, serviceDate: '2026-01-01'}),
    ).toBe(false);
  });
});
