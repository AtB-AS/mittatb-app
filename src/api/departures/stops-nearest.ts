import {AxiosRequestConfig} from 'axios';
import {CursoredData, CursoredQuery, StopPlaceDetails} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import client from '../client';
import {FavoriteDeparture} from '@atb/favorites/types';
import {StopPlaceQuayDepartures} from '../types/departures';
import {stringifyUrl} from 'query-string';
import {QuayDeparturesQuery} from '../types/generated/QuayDeparturesQuery';
import {NearestStopPlacesQuery} from '../types/generated/NearestStopPlacesQuery';

export type StopsNearestQuery = CursoredQuery<{
  latitude: number;
  longitude: number;
  count?: number;
  distance?: number;
  after?: string;
}>;

export type StopPlaceDeparturesPayload = {
  location: {
    layer: 'venue';
    id: string;
  };
  favorites?: FavoriteDeparture[];
};

export type StopPlaceDeparturesQuery = {
  id: string;
  numberOfDepartures?: number;
  startTime?: string;
  timeRange?: number;
};

export type QuayDeparturesVariables = {
  id: string;
  numberOfDepartures?: number;
  startTime?: string;
  timeRange?: number;
};

export type StopPlaceMetadata = CursoredData<StopPlaceDetails[]>;

const BASE_URL = 'bff/v2/departures';

export async function getNearestStops(
  query: StopsNearestQuery,
  opts?: AxiosRequestConfig,
): Promise<NearestStopPlacesQuery> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}/stops-nearest?${queryString}`;
  return request(url, opts);
}

export async function getStopPlaceDepartures(
  query: StopPlaceDeparturesQuery,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceQuayDepartures> {
  const url = `${BASE_URL}/stop-departures`;
  return requestStopPlaceDepartures(stringifyUrl({url, query}), opts);
}

export async function getQuayDepartures(
  query: QuayDeparturesVariables,
  opts?: AxiosRequestConfig,
): Promise<QuayDeparturesQuery> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}/quay-departures?${queryString}`;
  return requestQuayDepartures(url, opts);
}

async function request(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<NearestStopPlacesQuery> {
  const response = await client.get<NearestStopPlacesQuery>(url, opts);
  return response.data;
}

async function requestQuayDepartures(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<QuayDeparturesQuery> {
  const response = await client.get<QuayDeparturesQuery>(url, opts);
  return response.data;
}

async function requestStopPlaceDepartures(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceQuayDepartures> {
  const response = await client.get<StopPlaceQuayDepartures>(url, opts);
  return response.data;
}
