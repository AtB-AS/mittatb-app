import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {bookingAvailabilitySearch} from '@atb/api/trips';
import {useQuery} from '@tanstack/react-query';
import type {TripPatternWithBooking} from '@atb/api/types/trips';

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

  const queryKey = [
    'tripsWithAvailability',
    stopPlaces?.from?.id,
    stopPlaces?.to?.id,
    travelDate,
    userProfilesWithCount.map((up) => up.id),
    preassignedFareProduct.id,
  ];

  const {data, isFetching, isSuccess, isError, isLoading, refetch} = useQuery({
    queryKey,
    queryFn: () =>
      bookingAvailabilitySearch({
        fromStopPlaceId: stopPlaces?.from?.id!,
        toStopPlaceId: stopPlaces?.to?.id!,
        searchTime: travelDate ?? new Date().toISOString(),
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
    ? data?.trip.tripPatterns.filter(tripPatternFilter)
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

function tripPatternFilter(tp: TripPatternWithBooking): boolean {
  return (
    tp.booking.availability !== 'unknown' &&
    tp.booking.availability !== 'booking_not_supported'
  );
}
