import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {bookingAvailabilitySearch} from '@atb/api/bff/trips';
import {useQuery} from '@tanstack/react-query';
import type {TripPatternWithBooking} from '@atb/api/types/trips';
import {startOfDay} from 'date-fns';
import {useMemo} from 'react';
import {
  isValidSelection,
  tripPatternAvailabilityFilter,
  tripPatternDisplayTimeFilter,
} from './utils';

type BookingTripsType = {
  tripPatterns: TripPatternWithBooking[];
  isBookingRequired: boolean;
  isLoadingBooking: boolean;
  isError: boolean;
  isEmpty: boolean;
  reload: () => void;
};

export function useBookingTrips({
  selection,
}: {
  selection: PurchaseSelectionType;
}): BookingTripsType {
  const {
    stopPlaces,
    travelDate,
    preassignedFareProduct,
    userProfilesWithCount,
  } = selection;

  // We always search from the start of the day to ensure we get all trips for that day
  // The trip search in BFF searches 24 hours from searchTime
  const searchTime = useMemo(
    () => (!!travelDate ? startOfDay(travelDate) : startOfDay(new Date())),
    [travelDate],
  );

  const queryKey = [
    'tripsWithAvailability',
    stopPlaces?.from?.id,
    stopPlaces?.to?.id,
    searchTime.toISOString(),
    userProfilesWithCount.map((up) => up.id),
    preassignedFareProduct.id,
  ];

  const {data, isFetching, isSuccess, isError, isLoading, refetch} = useQuery({
    queryKey,
    queryFn: () =>
      bookingAvailabilitySearch({
        fromStopPlaceId: stopPlaces?.from?.id!,
        toStopPlaceId: stopPlaces?.to?.id!,
        searchTime: searchTime.toISOString(),
        products: [preassignedFareProduct.id],
        travellers: userProfilesWithCount.map((p) => ({
          id: p.id,
          userType: p.userTypeString,
          count: p.count,
        })),
      }),
    enabled:
      !!selection.preassignedFareProduct.isBookingEnabled &&
      isValidSelection(selection),
    retry: 3,
  });

  const tripPatterns = isSuccess
    ? data?.trip.tripPatterns
        .filter(tripPatternAvailabilityFilter)
        .filter((tp) =>
          tripPatternDisplayTimeFilter(
            tp,
            travelDate ?? new Date().toISOString(),
          ),
        )
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
    isBookingRequired: !!preassignedFareProduct.isBookingEnabled,
    tripPatterns,
    reload: refetch,
    isError: isError,
    isEmpty: !isFetching && tripPatterns.length === 0,
  };
}
