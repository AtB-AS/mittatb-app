import {useVehicle} from './use-vehicle';
import {useActiveShmoBookingQuery} from './queries/use-active-shmo-booking-query';
import {PricingSegmentFragment} from '@atb/api/types/generated/fragments/mobility-shared';
import {ShmoBooking} from '@atb/api/types/mobility';
import {useEffect, useState} from 'react';
import {useShmoBookingQuery} from './queries/use-shmo-booking-query';

export const useRelevantVehicleData = (vehicleId: string) => {
  const {
    vehicle,
    isLoading: vehicleIsLoading,
    isError: vehicleIsError,
    operatorId: vehicleOperatorId,
    operatorName: vehicleOperatorName,
    rentalAppUri,
    brandLogoUrl,
    appStoreUri,
  } = useVehicle(vehicleId);
  const {
    data: activeBooking,
    isLoading: activeIsLoading,
    isError: activeIsError,
  } = useActiveShmoBookingQuery();

  const [currentBookingId, setCurrentBookingId] =
    useState<ShmoBooking['bookingId']>();

  const {data: booking} = useShmoBookingQuery(currentBookingId);
  console.log('booking', booking);

  console.log('active', activeBooking);

  useEffect(() => {
    if (activeBooking) {
      setCurrentBookingId(activeBooking.bookingId);
    }
  }, [activeBooking]);

  const isLoading = booking ? activeIsLoading : vehicleIsLoading;
  const isError = booking ? activeIsError : vehicleIsError;

  const operatorId = booking ? booking?.operator?.id : vehicleOperatorId;

  console.log(booking, 'activeBooking');
  console.log(operatorId, 'actiive');

  const operatorName = booking ? booking?.operator?.name : vehicleOperatorName;

  const activeBookingState = booking?.state;

  const pricingPlan = booking
    ? {
        price: booking?.pricingPlan?.price,
        perMinPricing: booking?.pricingPlan
          ?.perMinPricing as unknown as Array<PricingSegmentFragment>,
        perKmPricing: [],
      }
    : vehicle?.pricingPlan;

  const currentFuelPercent = booking
    ? booking?.stateOfCharge
    : vehicle?.currentFuelPercent;

  const currentRangeMeters = booking
    ? (booking?.currentRangeKm as number) * 1000
    : vehicle?.currentRangeMeters;

  const departureTime = booking?.departureTime ?? new Date();

  return {
    vehicle,
    isLoading,
    isError,
    operatorId,
    operatorName,
    rentalAppUri,
    brandLogoUrl,
    appStoreUri,
    bookingId: currentBookingId,
    activeBookingState,
    pricingPlan,
    currentFuelPercent,
    currentRangeMeters,
    departureTime,
    arrivalTime: booking?.arrivalTime,
    totalAmount: booking?.pricing?.currentAmount,
    setCurrentBookingId,
  };
};
