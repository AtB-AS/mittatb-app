import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {GetServiceJourneyVehicles} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';
import {ApolloClient, gql} from '@apollo/client';

const DEFAULT_FETCH_POLICY = 'no-cache';

export const getServiceJourneyVehicles = async (
  serviceJourneyIds?: string[],
  opts?: AxiosRequestConfig,
): Promise<GetServiceJourneyVehicles | undefined> => {
  if (!serviceJourneyIds?.length) {
    return;
  }
  const url = '/bff/v2/vehicles/service-journeys';
  const query = qs.stringify({
    serviceJourneyIds,
  });
  const result = await client.get<GetServiceJourneyVehicles>(
    stringifyUrl(url, query),
    {
      ...opts,
    },
  );

  return result.data;
};

export const getLiveVehicleSubscription = (
  serviceJourneyId: string,
  client: ApolloClient<object>,
) => {
  return client.subscribe({
    query: VEHICLE_UPDATES_SUBSCRIPTION,
    fetchPolicy: DEFAULT_FETCH_POLICY,
    variables: {
      serviceJourneyId: serviceJourneyId,
      includePointsOnLink: false,
    },
  });
};

export const VEHICLE_FRAGMENT = gql`
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
