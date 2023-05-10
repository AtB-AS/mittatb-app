import {useEffect} from 'react';
import {useRealtimeMapEnabled} from '@atb/components/map';
import {getLiveVehicleSubscription} from '@atb/api/vehicles';
import {VehicleWithPosition} from '@atb/api/types/vehicles';

export function useGetLiveServiceJourneyVehicles(
  setVehicle: (vehicle: VehicleWithPosition) => void,
  serviceJourneyId?: string,
) {
  const realtimeMapEnabled = useRealtimeMapEnabled();

  // Set up subscription to receive updates on vehicles
  useEffect(() => {
    if (!serviceJourneyId || !realtimeMapEnabled) return;

    const subscription = getLiveVehicleSubscription(serviceJourneyId);

    subscription.onmessage = (event) => {
      const vehicle = JSON.parse(event.data) as VehicleWithPosition;
      setVehicle(vehicle);
    };
    return () => subscription.close(1000);
  }, [serviceJourneyId, realtimeMapEnabled]);
}
