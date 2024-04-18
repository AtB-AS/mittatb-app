import {hasShortWaitTimeAndNotGuaranteedCorrespondence} from '../utils';
import {Leg} from '@atb/api/types/trips';

describe('hasShortWaitTimeAndNotGuaranteedCorrespondence', () => {
  const s1 = false;
  it(`should be ${s1} if not short wait time`, () => {
    const legs = [
      {expectedEndTime: '2024-10-31T14:55:00Z'},
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(s1);
  });

  const s2 = true;
  it(`should be ${s2} if short wait time and no guarenteed correspondance`, () => {
    const legs = [
      {expectedEndTime: '2024-10-31T14:59:00Z'},
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(s2);
  });

  const s3 = false;
  it(`should be ${s3} if short wait time, but correspondance is guarenteed`, () => {
    const legs = [
      {
        expectedEndTime: '2024-10-31T14:59:00Z',
        interchangeTo: {guaranteed: true},
      },
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(s3);
  });

  const s4 = false;
  it(`should be ${s4} if not short wait time and correspondance is guarenteed`, () => {
    const legs = [
      {
        expectedEndTime: '2024-10-31T14:55:00Z',
        interchangeTo: {guaranteed: true},
      },
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(s4);
  });

  const s5 = true;
  it(`should be ${s5} if wait time between two legs are short and correspondance is not guranteed.`, () => {
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

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(s5);
  });

  const s6 = false;
  it(`should be ${s6} as even when short wait time at before the next bus departure.`, () => {
    const legs = [
      {
        mode: 'foot',
        expectedStartTime: '2024-10-31T14:45:00Z',
        expectedEndTime: '2024-10-31T15:00:00Z',
      },
      {
        expectedStartTime: '2024-10-31T15:00:00Z',
        expectedEndTime: '2024-10-31T15:05:00Z',
      },
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(s6);
  });

  it(`should .`, () => {});

  const s7 = false;
  it(`should be ${s7} even if there is short wait time between bus and walking.`, () => {
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
        expectedStartTime: '2024-10-31T15:6:00Z',
        expectedEndTime: '2024-10-31T15:20:00Z',
      },
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(s7);
  });

  const s8 = false;
  it(`should be ${s8} even if there is short wait time between multiple bus and walking legs.`, () => {
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
      {
        mode: 'foot',
        expectedStartTime: '2024-10-31T15:25:00Z',
        expectedEndTime: '2024-10-31T15:30:00Z',
      },
      {
        expectedStartTime: '2024-10-31T15:31:00Z',
        expectedEndTime: '2024-10-31T15:40:00Z',
      },
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(s8);
  });
});
