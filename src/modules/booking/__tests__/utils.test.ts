import {
  tripPatternAvailabilityFilter,
  tripPatternDisplayTimeFilter,
} from '../utils';
import type {TripPatternWithBooking} from '@atb/api/types/trips';
import {endOfDay} from 'date-fns';

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
});
