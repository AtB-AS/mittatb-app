//import {addMinutes} from 'date-fns';
import {hasShortWaitTimeAndNotGuaranteedCorrespondence} from '../utils';
import {Leg} from '@atb/api/types/trips';

describe('hasShortWaitTimeAndNotGuaranteedCorrespondence', () => {
  it('should be false if not short wait time', () => {
    const legs = [
      {expectedEndTime: '2024-10-31T14:55:00Z'},
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be true if short wait time and no guarenteed correspondance', () => {
    const legs = [
      {expectedEndTime: '2024-10-31T14:59:00Z'},
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(true);
  });

  it('should be false if short wait time, but correspondance is guarenteed', () => {
    const legs = [
      {
        expectedEndTime: '2024-10-31T14:59:00Z',
        interchangeTo: {guaranteed: true},
      },
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be false if not short wait time and correspondance is guarenteed', () => {
    const legs = [
      {
        expectedEndTime: '2024-10-31T14:55:00Z',
        interchangeTo: {guaranteed: true},
      },
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be true if wait time between two legs are short and correspondance is not guranteed.', () => {
    const legs = [
      {
        expectedStartTime: '2024-10-31T14:59:00Z',
        expectedEndTime: '2024-10-31T15:00:00Z',
        interchangeTo: {guaranteed: true},
      },
      {
        expectedStartTime: '2024-10-31T15:02:00Z',
        expectedEndTime: '2024-10-31T15:10:00Z',
      },
      {
        expectedStartTime: '2024-10-31T15:12:00Z',
        expectedEndTime: '2024-10-31T15:20:00Z',
      },
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(true);
  });

  it('should be true as there are is short wait time at the stop before the departure of the last buss.', () => {
    const legs = [
      {
        expectedStartTime: '2024-10-31T14:45:00Z',
        expectedEndTime: '2024-10-31T15:00:00Z',
      },
      {
        mode: 'foot',
        expectedStartTime: '2024-10-31T15:00:00Z',
        expectedEndTime: '2024-10-31T15:05:00Z',
      },
      {
        expectedStartTime: '2024-10-31T15:06:00Z',
        expectedEndTime: '2024-10-31T15:20:00Z',
      },
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(true);
  });
});
