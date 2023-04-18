import {useEffect, useState} from 'react';
import {FetchResult, gql, useApolloClient} from '@apollo/client';
import {parseISO} from 'date-fns';
import {VehiclePosition} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';

const DEFAULT_FETCH_POLICY = 'no-cache';

export function useGetLiveServiceJourneyVehicles(
  filter: Filter,
  initialVehiclePosition?: VehiclePosition,
) {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);
  const client = useApolloClient();
  useEffect(() => {
    if (initialVehiclePosition) {
      setVehicles([initialVehiclePosition]);
    }
  }, [initialVehiclePosition]);

  /**
   * Set up subscription to receive updates on vehicles
   */
  useEffect(() => {
    const subscription = client
      .subscribe({
        query: VEHICLE_UPDATES_SUBSCRIPTION,
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: {
          ...filter,
          includePointsOnLink: false,
        },
      })
      .subscribe((fetchResult: FetchResult) => {
        if (fetchResult?.data?.vehicleUpdates.length > 0) {
          setVehicles(fetchResult?.data?.vehicleUpdates as VehiclePosition[]);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialVehiclePosition, client, filter]);

  return vehicles;
}

const DEFAULT_INACTIVE_VEHICLE_IN_SECONDS = 60;

const _isVehicleInactive = (vehicle: VehiclePosition, options: Options) => {
  const nowSeconds = Date.now() / 1000;
  return (
    parseISO(vehicle.lastUpdated).getTime() +
      (options?.markInactiveAfterSeconds ||
        DEFAULT_INACTIVE_VEHICLE_IN_SECONDS) <
    nowSeconds
  );
};

export type Filter = {
  serviceJourneyId?: string;
  mode?: string;
  boundingBox?: string;
  monitored?: boolean;
};
export type Options = {
  markInactive?: boolean;
  markInactiveAfterSeconds?: number;
};

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
