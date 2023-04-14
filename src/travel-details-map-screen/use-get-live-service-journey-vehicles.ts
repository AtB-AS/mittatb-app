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
  /*const mut = useMutation(VEHICLE_UPDATES_SUBSCRIPTION);
  const res = useSubscription(VEHICLE_UPDATES_SUBSCRIPTION, {
    fetchPolicy: DEFAULT_FETCH_POLICY,
    variables: {
      ...filter,
      ...subscriptionOptions,
      includePointsOnLink: false,
    },
  });*/

  /**
   * Set up subscription to receive updates on vehicles
   */
  useEffect(() => {
    /**
     * To avoid triggering re-renders too frequently, buffer subscription updates
     * and set a timer to dispatch the update on a given interval.
     */
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
  const nowTime = new Date();
  return (
    parseISO(vehicle.lastUpdated).getTime() +
      (options?.markInactiveAfterSeconds ||
        DEFAULT_INACTIVE_VEHICLE_IN_SECONDS) <
    nowTime.getTime()
  );
};

export enum ActionType {
  HYDRATE,
  UPDATE,
}

export type Action = {
  type: ActionType;
  payload?: VehiclePosition[] | VehiclePosition;
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

export enum VEHICLE_MODE {
  AIR = 'air',
  BUS = 'bus',
  COACH = 'coach',
  FERRY = 'ferry',
  METRO = 'metro',
  RAIL = 'rail',
  TRAM = 'tram',
}

const VEHICLE_FRAGMENT = gql`
  fragment VehicleFragment on VehicleUpdate {
    serviceJourney {
      id
      pointsOnLink @include(if: $includePointsOnLink) {
        length
        points
      }
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

export const VEHICLES_QUERY = gql`
  query VehiclesQuery(
    $serviceJourneyId: String
    $monitored: Boolean
    $includePointsOnLink: Boolean!
  ) {
    vehicles(serviceJourneyId: $serviceJourneyId, monitored: $monitored) {
      ...VehicleFragment
    }
  }
  ${VEHICLE_FRAGMENT}
`;

export const VEHICLE_UPDATES_SUBSCRIPTION = gql`
  subscription VehicleUpdates(
    $serviceJourneyId: String
    $monitored: Boolean
    $includePointsOnLink: Boolean!
  ) {
    vehicleUpdates(serviceJourneyId: $serviceJourneyId, monitored: $monitored) {
      ...VehicleFragment
    }
  }
  ${VEHICLE_FRAGMENT}
`;
