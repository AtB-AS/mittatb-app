import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {bookingAvailabilitySearch} from '@atb/api/trips';
import {useQuery} from '@tanstack/react-query';
import type {TripPatternWithBooking} from '@atb/api/types/trips';
import {isBefore} from '@atb/utils/date';
import {endOfDay} from 'date-fns';
import {useMemo} from 'react';

type BookingTripsType = {
  tripPatterns: TripPatternWithBooking[];
  isLoadingBooking: boolean;
  isError: boolean;
  isEmpty: boolean;
  reload: () => void;
};

export function useBookingTrips({
  selection,
  enabled,
}: {
  selection: PurchaseSelectionType;
  enabled: boolean;
}): BookingTripsType {
  const {
    stopPlaces,
    travelDate,
    preassignedFareProduct,
    userProfilesWithCount,
  } = selection;

  const searchTime = useMemo(
    () => travelDate ?? new Date().toISOString(),
    [travelDate],
  );

  const queryKey = [
    'tripsWithAvailability',
    stopPlaces?.from?.id,
    stopPlaces?.to?.id,
    searchTime,
    userProfilesWithCount.map((up) => up.id),
    preassignedFareProduct.id,
  ];

  const {data, isFetching, isSuccess, isError, isLoading, refetch} = useQuery({
    queryKey,
    queryFn: () =>
      bookingAvailabilitySearch({
        fromStopPlaceId: stopPlaces?.from?.id!,
        toStopPlaceId: stopPlaces?.to?.id!,
        searchTime: searchTime,
        products: [preassignedFareProduct.id],
        travellers: userProfilesWithCount.map((p) => ({
          id: p.id,
          userType: p.userTypeString,
          count: p.count,
        })),
      }),
    enabled: enabled && isValidSelection(selection),
    retry: 3,
  });

  const tripPatterns = isSuccess
    ? data?.trip.tripPatterns
        .filter(tripPatternAvailabilityFilter)
        .filter((tp) => tripPatternTimeFilter(tp, searchTime))
    : [];

  return {
    /**
     * We want the truth table to be like this, for smooth user experience:
     *
     * Before initial load (isLoading === true && isFetching === false):              The query is not loading
     * During initial load (isLoading === true && isFetching === true):               The query is loading
     * After initial load, no refetch (isLoading === false && isFetching === false):  The query is not loading
     * At refetch (isLoading === false && isFetching === true):                       The query is not loading
     */
    isLoadingBooking: isLoading && isFetching,
    tripPatterns,
    reload: refetch,
    isError: isError,
    isEmpty: !isFetching && tripPatterns.length === 0,
  };
}

function isValidSelection(selection: PurchaseSelectionType) {
  const isBoatSingleFareProduct =
    selection.fareProductTypeConfig.direction === 'one-way' &&
    selection.fareProductTypeConfig.configuration.zoneSelectionMode ===
      'multiple-stop-harbor';
  return (
    !!selection.stopPlaces?.from &&
    !!selection.stopPlaces?.to &&
    isBoatSingleFareProduct
  );
}

function tripPatternAvailabilityFilter(tp: TripPatternWithBooking): boolean {
  return (
    tp.booking.availability !== 'unknown' &&
    tp.booking.availability !== 'booking_not_supported'
  );
}

function tripPatternTimeFilter(
  tp: TripPatternWithBooking,
  searchTime: string,
): boolean {
  return isBefore(tp.expectedStartTime, endOfDay(searchTime));
}
