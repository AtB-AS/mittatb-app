import client from './client';
import {AxiosRequestConfig} from 'axios';
import {TripPattern, TripsQuery} from '@atb/api/types/trips';
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

  let data = await post<TripsQuery>(url, cleanQuery, opts);

  if (data.trip?.tripPatterns) {
    data.trip.tripPatterns = data.trip?.tripPatterns.map((tripPattern) => {
      (tripPattern as TripPattern).id = generateIdFromTripPattern(tripPattern);
      return tripPattern;
    });
  }

  return data;
}

function generateIdFromTripPattern(tripPattern: TripPattern) {
  const id =
    tripPattern.compressedQuery +
    tripPattern.legs
      .map((leg) => {
        return leg.toPlace.longitude.toString() + leg.toPlace.latitude;
      })
      .join('-');
  return id;
}

export async function singleTripSearch(
  queryString: string | null,
  opts?: AxiosRequestConfig,
): Promise<TripsQuery | null> {
  if (!queryString) {
    return null;
  }
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
    // baseURL: 'http://10.0.2.2:8080', // uncomment for local BFF
  });

  return response.data;
}
