import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {bookingAvailabilitySearch} from '@atb/api/trips';
import {useQuery} from '@tanstack/react-query';
import type {TripPatternWithBooking} from '@atb/api/types/trips';

type BookingTripsType = {
  tripPatterns: TripPatternWithBooking[];
  isLoadingBooking: boolean;
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

  const {data, isFetching, isSuccess, refetch} = useQuery({
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
        })),
      }),
    enabled: enabled && isValid(selection),
    retry: 3,
  });

  return {
    isLoadingBooking: isFetching,
    tripPatterns: isSuccess ? data?.trip.tripPatterns : [],
    reload: refetch,
  };
}

function isValid(selection: PurchaseSelectionType) {
  return !!selection.stopPlaces?.from && !!selection.stopPlaces?.to;
}
