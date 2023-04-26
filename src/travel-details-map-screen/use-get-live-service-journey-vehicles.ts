import {useEffect} from 'react';
import {
  GetServiceJourneyVehicleQuery,
  VehiclePosition,
} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';
import {useRealtimeMapEnabled} from '@atb/components/map/hooks/use-realtime-map-enabled';
import {getLiveVehicleSubscription} from '@atb/api/vehicles';

export function useGetLiveServiceJourneyVehicles(
  setVehicle: (vehicle: VehiclePosition) => void,
  serviceJourneyId?: string,
) {
  const realtimeMapEnabled = useRealtimeMapEnabled();

  // Set up subscription to receive updates on vehicles
  useEffect(() => {
    if (!realtimeMapEnabled) return;
    if (!serviceJourneyId) return;

    const subscription = getLiveVehicleSubscription(serviceJourneyId);

    subscription.onmessage = (event) => {
      const vehicles = JSON.parse(event.data) as GetServiceJourneyVehicleQuery;
      const vehicle = vehicles.vehicles?.find((v) => {
        return v.serviceJourney?.id === serviceJourneyId;
      });
      if (vehicle) {
        setVehicle(vehicle);
      }
    };
    return () => subscription.close(1000);
  }, [serviceJourneyId, realtimeMapEnabled]);
}
