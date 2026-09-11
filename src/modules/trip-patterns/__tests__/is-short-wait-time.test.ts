import {type TransferLeg} from '@atb-as/utils';
import {isShortWaitTime, isTransferInto, significantWaitTime} from '../utils';

describe('significantWaitTime', () => {
  it('should be false for 0 seconds', () => {
    expect(significantWaitTime(0)).toBe(false);
  });

  it('should be false for 30 seconds (boundary)', () => {
    expect(significantWaitTime(30)).toBe(false);
  });

  it('should be true for 31 seconds', () => {
    expect(significantWaitTime(31)).toBe(true);
  });
});

describe('isShortWaitTime', () => {
  it('should be true for 0 seconds (a flush transfer the planner vouched for)', () => {
    expect(isShortWaitTime(0)).toBe(true);
  });

  it('should be true for 1 second', () => {
    expect(isShortWaitTime(1)).toBe(true);
  });

  it('should be true for 30 seconds (too short to display as a duration)', () => {
    expect(isShortWaitTime(30)).toBe(true);
  });

  it('should be true for 31 seconds', () => {
    expect(isShortWaitTime(31)).toBe(true);
  });

  it('should be true for 180 seconds (the 3-min boundary, inclusive)', () => {
    expect(isShortWaitTime(180)).toBe(true);
  });

  it('should be false for 181 seconds (stated as an exact duration)', () => {
    expect(isShortWaitTime(181)).toBe(false);
  });

  it('should be false for negative values', () => {
    expect(isShortWaitTime(-10)).toBe(false);
  });
});

describe('isTransferInto', () => {
  const at = (minutes: number) =>
    new Date(Date.UTC(2026, 5, 3, 12, minutes)).toISOString();

  const transit = (id = 'ATB:ServiceJourney:1'): TransferLeg => ({
    aimedStartTime: at(0),
    expectedStartTime: at(0),
    expectedEndTime: at(10),
    serviceJourney: {id},
  });

  const walk = (): TransferLeg => ({
    aimedStartTime: at(0),
    expectedStartTime: at(0),
    expectedEndTime: at(5),
  });

  it('is true boarding a service straight after another service', () => {
    expect(isTransferInto([transit('a'), transit('b')], 1)).toBe(true);
  });

  it('is true boarding a service after a walk between stops', () => {
    expect(isTransferInto([transit('a'), walk(), transit('b')], 2)).toBe(true);
  });

  it('is false for the first service, reached by walking from the origin', () => {
    expect(isTransferInto([walk(), transit()], 1)).toBe(false);
  });

  it('is false for a service that starts the trip', () => {
    expect(isTransferInto([transit(), walk()], 0)).toBe(false);
  });

  it('is false for the walk to the destination', () => {
    expect(isTransferInto([transit(), walk()], 1)).toBe(false);
  });

  it('is false for a trip with no service at all', () => {
    expect(isTransferInto([walk(), walk()], 1)).toBe(false);
  });

  it('is false for an index past the end', () => {
    expect(isTransferInto([transit(), transit()], 5)).toBe(false);
  });
});
