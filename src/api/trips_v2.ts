import client from './client';
import {AxiosRequestConfig} from 'axios';
import {TripsQuery, TripsQueryWithJourneyIds} from '@atb/api/types/trips';
import {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';

export async function tripsSearch(
  query: TripsQueryVariables,
  opts?: AxiosRequestConfig,
): Promise<TripsQuery> {
  const url = 'bff/v2/trips';
  const cleanQuery: TripsQueryVariables = {
    to: {
      name: query.to.name,
      coordinates: query.to.coordinates,
      place: query.to.place,
    },
    from: {
      name: query.from.name,
      coordinates: query.from.coordinates,
      place: query.from.place,
    },
    when: query.when,
  };

  /*
  const response = await client.post<TripsQuery>(url, cleanQuery, {
    ...opts,
    baseURL: 'http://10.0.2.2:8080/',
  });
  return response.data;
   */
  const data = await post<TripsQuery>(url, cleanQuery, opts);
  return data;
}

export async function singleTripSearch(
  queryString: string,
  opts?: AxiosRequestConfig,
): Promise<TripsQuery> {
  const url = '/bff/v2/singleTrip';
  const query = {
    compressedQuery: queryString,
  };
  const data = await post<TripsQuery>(url, query, opts);
  return data;
}

async function post<T>(
  url: string,
  query: any,
  opts?: AxiosRequestConfig<any>,
) {
  const response = await client.post<T>(url, query, {
    ...opts,
    baseURL: 'http://10.0.2.2:8080',
  });

  return response.data;
}
