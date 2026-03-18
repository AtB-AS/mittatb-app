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

  it('returns true when latestDate is not provided and trip is within the day', () => {
    const tripPattern: TripPatternWithBooking = {
      expectedStartTime: '2023-10-01T18:00:00.000Z',
    } as TripPatternWithBooking;
    expect(tripPatternDisplayTimeFilter(tripPattern, travelDate)).toBe(true);
  });

  it('returns true when trip is before latestDate', () => {
    const tripPattern: TripPatternWithBooking = {
      expectedStartTime: '2023-10-01T10:00:00.000Z',
    } as TripPatternWithBooking;
    expect(
      tripPatternDisplayTimeFilter(
        tripPattern,
        travelDate,
        '2023-10-01T12:00:00.000Z',
      ),
    ).toBe(true);
  });

  it('returns false when trip is after latestDate', () => {
    const tripPattern: TripPatternWithBooking = {
      expectedStartTime: '2023-10-01T14:00:00.000Z',
    } as TripPatternWithBooking;
    expect(
      tripPatternDisplayTimeFilter(
        tripPattern,
        travelDate,
        '2023-10-01T12:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('returns false when trip is exactly at latestDate', () => {
    const tripPattern: TripPatternWithBooking = {
      expectedStartTime: '2023-10-01T12:00:00.000Z',
    } as TripPatternWithBooking;
    expect(
      tripPatternDisplayTimeFilter(
        tripPattern,
        travelDate,
        '2023-10-01T12:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('returns false when trip is before travelDate even if before latestDate', () => {
    const tripPattern: TripPatternWithBooking = {
      expectedStartTime: '2023-09-30T23:00:00.000Z',
    } as TripPatternWithBooking;
    expect(
      tripPatternDisplayTimeFilter(
        tripPattern,
        travelDate,
        '2023-10-01T12:00:00.000Z',
      ),
    ).toBe(false);
  });
});
