import {Leg} from '@atb/api/types/trips';
import {ticketCoversEntireTrip} from '../utils';

describe('ticketCoversEntireTrip', () => {
  const s1 = true;
  it(`should be ${s1} if ticket is valid before the last bus interchange.`, () => {
    const legs = [
      {
        mode: 'bus',
        expectedStartTime: '2024-10-31T15:00:00Z',
        expectedEndTime: '2024-10-31T15:15:00Z',
      },
      {
        mode: 'bus',
        expectedStartTime: '2024-10-31T15:20:00Z',
        expectedEndTime: '2024-10-31T17:40:00Z',
      },
    ] as Leg[];

    expect(ticketCoversEntireTrip(legs)).toBe(s1);
  });

  const s2 = false;
  it(`should be ${s2} if ticket is not valid before the last bus interchange.`, () => {
    const legs = [
      {
        mode: 'bus',
        expectedStartTime: '2024-10-31T15:00:00Z',
        expectedEndTime: '2024-10-31T16:00:00Z',
      },
      {
        mode: 'bus',
        expectedStartTime: '2024-10-31T16:35:00Z',
        expectedEndTime: '2024-10-31T17:00:00Z',
      },
    ] as Leg[];

    expect(ticketCoversEntireTrip(legs)).toBe(s2);
  });

  const s3 = true;
  it(`should be ${s2} if ticket is valid before the last bus interchange and the trip continious with more legs after the last bus interchange.`, () => {
    const legs = [
      {
        mode: 'bus',
        expectedStartTime: '2024-10-31T15:00:00Z',
        expectedEndTime: '2024-10-31T16:00:00Z',
      },
      {
        mode: 'bus',
        expectedStartTime: '2024-10-31T16:25:00Z',
        expectedEndTime: '2024-10-31T17:00:00Z',
      },
      {
        mode: 'foot',
        expectedStartTime: '2024-10-31T17:00:00Z',
        expectedEndTime: '2024-10-31T17:10:00Z',
      },
    ] as Leg[];

    expect(ticketCoversEntireTrip(legs)).toBe(s3);
  });
});
