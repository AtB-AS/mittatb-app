import {useEffect} from 'react';
import {VehiclePosition} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';
import {useRealtimeMapEnabled} from '@atb/components/map/hooks/use-realtime-map-enabled';
import {getLiveVehicleSubscription} from '@atb/api/vehicles';

export function useGetLiveServiceJourneyVehicles(
  setVehicle: (vehicle: VehiclePosition) => void,
  serviceJourneyId?: string,
) {
  const realtimeMapEnabled = useRealtimeMapEnabled();

  // Set up subscription to receive updates on vehicles
  useEffect(() => {
    if (!serviceJourneyId || !realtimeMapEnabled) return;

    const subscription = getLiveVehicleSubscription(serviceJourneyId);

    subscription.onmessage = (event) => {
      const vehicle = JSON.parse(event.data) as VehiclePosition;
      setVehicle(vehicle);
    };
    return () => subscription.close(1000);
  }, [serviceJourneyId, realtimeMapEnabled]);
}
