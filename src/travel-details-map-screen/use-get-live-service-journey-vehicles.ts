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

    let close = () => {};
    getLiveVehicleSubscription(serviceJourneyId).then((subscription) => {
      if (!subscription) return; // TODO: Handle case where socket couldn't be opened
      subscription.onmessage = (event) => {
        const vehicle = JSON.parse(event.data) as VehicleWithPosition;
        setVehicle(vehicle);
      };
      close = subscription.close;
    });
    return close;
  }, [serviceJourneyId, realtimeMapEnabled]);
}
