import {hasShortWaitTimeAndNotGuaranteedCorrespondence} from '../utils';
import {Leg} from '@atb/api/types/trips';

jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('@bugsnag/react-native', () => ({}));

describe('hasShortWaitTimeAndNotGuaranteedCorrespondence', () => {
  it('should be false when no short wait time.', () => {
    const legs = [
      {expectedEndTime: '2024-10-31T14:55:00Z'},
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be true when short wait time.', () => {
    const legs = [
      {expectedEndTime: '2024-10-31T14:59:00Z'},
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(true);
  });

  it('should be false when correspondance is guarenteed and short wait time.', () => {
    const legs = [
      {
        expectedEndTime: '2024-10-31T14:59:00Z',
        interchangeTo: {guaranteed: true},
      },
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be false when correspondance is guarenteed and no short wait time.', () => {
    const legs = [
      {
        expectedEndTime: '2024-10-31T14:55:00Z',
        interchangeTo: {guaranteed: true},
      },
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be true when no correspondance is guranteed, and short wait time between second and third leg.', () => {
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

  it('should be false despite short wait time between a pair of legs, because the second leg of the pair is a foot leg.', () => {
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
        expectedStartTime: '2024-10-31T15:10:00Z',
        expectedEndTime: '2024-10-31T15:20:00Z',
      },
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be false despite short wait time between multiple pair of legs, because the second leg of each pair is a foot leg.', () => {
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
        expectedStartTime: '2024-10-31T15:10:00Z',
        expectedEndTime: '2024-10-31T15:20:00Z',
      },
      {
        mode: 'foot',
        expectedStartTime: '2024-10-31T15:20:00Z',
        expectedEndTime: '2024-10-31T15:30:00Z',
      },
      {
        expectedStartTime: '2024-10-31T15:35:00Z',
        expectedEndTime: '2024-10-31T15:40:00Z',
      },
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be true when short wait time between a pair of legs , as the first leg of the pair is not the initial leg of the trip, and the second leg of the pair is not a foot leg.', () => {
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

  it('should be false despite short wait time a pair of legs, as interchange in the leg prior to the pair is guarenteed, and the first leg of the pair is a foot leg.', () => {
    const legs = [
      {
        expectedStartTime: '2024-10-31T14:45:00Z',
        expectedEndTime: '2024-10-31T15:00:00Z',
        interchangeTo: {guaranteed: true},
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

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be true when short wait time in a pair of legs, despite guarenteed interchange in the leg prior to a pair, as the first leg of the pair is not a foot leg.', () => {
    const legs = [
      {
        expectedStartTime: '2024-10-31T14:45:00Z',
        expectedEndTime: '2024-10-31T15:00:00Z',
        interchangeTo: {guaranteed: true},
      },
      {
        mode: 'bus',
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

  it('should be false when foot leg is the initial leg.', () => {
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

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be true when short wait time between a pair of legs, following a foot leg and a guranteed interchange from the leg prior to the foot leg.', () => {
    const legs = [
      {
        expectedStartTime: '2024-10-31T14:45:00Z',
        expectedEndTime: '2024-10-31T15:00:00Z',
        interchangeTo: {guaranteed: true},
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
        expectedStartTime: '2024-10-31T15:21:00Z',
        expectedEndTime: '2024-10-31T15:30:00Z',
      },
    ] as unknown as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(true);
  });
});
