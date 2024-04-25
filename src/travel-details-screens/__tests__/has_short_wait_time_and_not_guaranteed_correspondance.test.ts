import {hasShortWaitTimeAndNotGuaranteedCorrespondence} from '../utils';
import {Leg} from '@atb/api/types/trips';

describe('hasShortWaitTimeAndNotGuaranteedCorrespondence', () => {
  it('should be false because no short wait time.', () => {
    const legs = [
      {expectedEndTime: '2024-10-31T14:55:00Z'},
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be true because short wait time.', () => {
    const legs = [
      {expectedEndTime: '2024-10-31T14:59:00Z'},
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(true);
  });

  it('should be false despite short wait time, because correspondance is guarenteed.', () => {
    const legs = [
      {
        expectedEndTime: '2024-10-31T14:59:00Z',
        interchangeTo: {guaranteed: true},
      },
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });

  it('should be false because of no short wait time and correspondance is guarenteed.', () => {
    const legs = [
      {
        expectedEndTime: '2024-10-31T14:55:00Z',
        interchangeTo: {guaranteed: true},
      },
      {expectedStartTime: '2024-10-31T15:00:00Z'},
    ] as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(false);
  });
  it('should be true because short wait time between second and third leg, with no correspondance guranteed.', () => {
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

  it('should be false because short wait time between a pair of legs have no effect when the second leg of the pair have mode: foot.', () => {
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

  it('should be false because short wait time between a pair of legs have no effect when the second leg of the pair have mode: foot.', () => {
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

  it('should be true as there is short wait time between the second leg and the third leg.', () => {
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

  it('should be false despite short wait time between second and third leg, beacuse interchange is guarenteed first leg and mode equals foot in second leg.', () => {
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

  it('should be true because because of short wait time between second and third leg, and the mode in the second leg is not foot.', () => {
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

  it('should be true because of short wait time and no guarenteed correspondance.', () => {
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

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(true);
  });

  it('should be true because of short wait time between third and forth leg.', () => {
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

  it('should be true because of short wait time between third and forth leg.', () => {
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
        interchangeTo: {guaranteed: true},
      },
    ] as unknown as Leg[];

    expect(hasShortWaitTimeAndNotGuaranteedCorrespondence(legs)).toBe(true);
  });
});
