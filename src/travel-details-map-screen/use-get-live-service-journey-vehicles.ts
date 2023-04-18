import {useEffect, useState} from 'react';
import {FetchResult, gql, useApolloClient} from '@apollo/client';
import {VehiclePosition} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';
import {useRealtimeMapEnabled} from '@atb/components/map/hooks/use-realtime-map-enabled';

const DEFAULT_FETCH_POLICY = 'no-cache';

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
    if (!realtimeMapEnabled) return;

    const subscription = client
      .subscribe({
        query: VEHICLE_UPDATES_SUBSCRIPTION,
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: {
          serviceJourneyId: initialVehiclePosition?.serviceJourney?.id,
          includePointsOnLink: false,
        },
      })
      .subscribe((fetchResult: FetchResult) => {
        if (fetchResult?.data?.vehicleUpdates.length > 0) {
          setVehicles(fetchResult?.data?.vehicleUpdates as VehiclePosition[]);
        }
      });

    return subscription.unsubscribe;
  }, [initialVehiclePosition, client]);

  return vehicles;
}

const VEHICLE_FRAGMENT = gql`
  fragment VehicleFragment on VehicleUpdate {
    serviceJourney {
      id
    }
    mode
    lastUpdated
    lastUpdatedEpochSecond
    monitored
    bearing
    location {
      latitude
      longitude
    }
  }
`;
export const VEHICLE_UPDATES_SUBSCRIPTION = gql`
  subscription VehicleUpdates($serviceJourneyId: String, $monitored: Boolean) {
    vehicleUpdates(serviceJourneyId: $serviceJourneyId, monitored: $monitored) {
      ...VehicleFragment
    }
  }
  ${VEHICLE_FRAGMENT}
`;
