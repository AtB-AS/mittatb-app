import {
  tripPatternAvailabilityFilter,
  tripPatternDisplayTimeFilter,
} from '../utils';
import type {TripPatternWithBooking} from '@atb/api/types/trips';
import {endOfDay, subSeconds} from 'date-fns';

describe('tripPatternAvailabilityFilter', () => {
  it('returns true for supported booking availability', () => {
    const tripPattern: TripPatternWithBooking = {
      booking: {availability: 'available'},
    } as TripPatternWithBooking;
    expect(tripPatternAvailabilityFilter(tripPattern)).toBe(true);
  });

  it('returns false for unknown booking availability', () => {
    const tripPattern: TripPatternWithBooking = {
      booking: {availability: 'unknown'},
    } as TripPatternWithBooking;
    expect(tripPatternAvailabilityFilter(tripPattern)).toBe(false);
  });

  it('returns false for booking_not_supported availability', () => {
    const tripPattern: TripPatternWithBooking = {
      booking: {availability: 'booking_not_supported'},
    } as TripPatternWithBooking;
    expect(tripPatternAvailabilityFilter(tripPattern)).toBe(false);
  });
});

describe('tripPatternDisplayTimeFilter', () => {
  const travelDate = '2023-10-01T00:00:00.000Z';

  it('returns true for trip patterns within the selected day and after travelDate', () => {
    const tripPattern: TripPatternWithBooking = {
      expectedStartTime: '2023-10-01T12:00:00.000Z',
    } as TripPatternWithBooking;
    expect(tripPatternDisplayTimeFilter(tripPattern, travelDate)).toBe(true);
  });

  it('returns false for trip patterns before travelDate', () => {
    const tripPattern: TripPatternWithBooking = {
      expectedStartTime: '2023-09-30T23:59:59.000Z',
    } as TripPatternWithBooking;
    expect(tripPatternDisplayTimeFilter(tripPattern, travelDate)).toBe(false);
  });

  it('returns false for trip patterns after the end of the selected day', () => {
    const tripPattern: TripPatternWithBooking = {
      expectedStartTime: endOfDay(travelDate).toISOString(),
    } as TripPatternWithBooking;
    expect(tripPatternDisplayTimeFilter(tripPattern, travelDate)).toBe(false);
  });

  describe('with gracePeriodSeconds', () => {
    it('returns true for trip 5 minutes before travelDate with 600s grace period', () => {
      const tripPattern = {
        expectedStartTime: subSeconds(
          new Date(travelDate),
          300,
        ).toISOString(),
      } as TripPatternWithBooking;
      expect(tripPatternDisplayTimeFilter(tripPattern, travelDate, 600)).toBe(
        true,
      );
    });

    it('returns false for trip 11 minutes before travelDate with 600s grace period', () => {
      const tripPattern = {
        expectedStartTime: subSeconds(
          new Date(travelDate),
          660,
        ).toISOString(),
      } as TripPatternWithBooking;
      expect(tripPatternDisplayTimeFilter(tripPattern, travelDate, 600)).toBe(
        false,
      );
    });

    it('returns true for trip exactly 10 minutes before travelDate with 600s grace period', () => {
      const tripPattern = {
        expectedStartTime: subSeconds(
          new Date(travelDate),
          600,
        ).toISOString(),
      } as TripPatternWithBooking;
      expect(tripPatternDisplayTimeFilter(tripPattern, travelDate, 600)).toBe(
        true,
      );
    });

    it('returns false for trip before travelDate with default (0s) grace period', () => {
      const tripPattern = {
        expectedStartTime: subSeconds(new Date(travelDate), 1).toISOString(),
      } as TripPatternWithBooking;
      expect(tripPatternDisplayTimeFilter(tripPattern, travelDate)).toBe(false);
    });
  });
});
