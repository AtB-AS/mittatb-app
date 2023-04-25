import {useEffect, useState} from 'react';
import {FetchResult, useApolloClient} from '@apollo/client';
import {VehiclePosition} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';
import {useRealtimeMapEnabled} from '@atb/components/map';
import {getLiveVehicleSubscription} from '@atb/api/vehicles';

export function useGetLiveServiceJourneyVehicles(
  initialVehiclePosition?: VehiclePosition,
) {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);
  const client = useApolloClient();
  const realtimeMapEnabled = useRealtimeMapEnabled();
  useEffect(() => {
    if (initialVehiclePosition) {
      setVehicles([initialVehiclePosition]);
    }
  }, [initialVehiclePosition]);

  // Set up subscription to receive updates on vehicles
  useEffect(() => {
    if (!realtimeMapEnabled || !initialVehiclePosition?.serviceJourney?.id)
      return;

    const subscription = getLiveVehicleSubscription(
      initialVehiclePosition?.serviceJourney?.id,
      client,
    ).subscribe((fetchResult: FetchResult) => {
      if (fetchResult?.data?.vehicleUpdates.length > 0) {
        setVehicles(fetchResult?.data?.vehicleUpdates as VehiclePosition[]);
      }
    });

    return subscription.unsubscribe;
  }, [initialVehiclePosition, client, realtimeMapEnabled]);

  return vehicles;
}
