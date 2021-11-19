import {AxiosRequestConfig} from 'axios';
import {CursoredData, CursoredQuery, StopPlaceDetails} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import client from '../client';
import {FavoriteDeparture} from '@atb/favorites/types';
import {StopPlaceQuayDepartures, EstimatedCall} from '../types/departures';
import {stringifyUrl} from 'query-string';

export type StopsNearestQuery = CursoredQuery<{
  lat: number;
  lon: number;
  distance?: number;
  includeUnusedQuays?: boolean;
}>;

export type StopPlaceDeparturesPayload = {
  location: {
    layer: 'venue';
    id: string;
  };
  favorites?: FavoriteDeparture[];
};

export type StopPlaceDeparturesQuery = CursoredQuery<{
  filterByInUse?: boolean;
  id: string;
  numberOfDepartures?: number;
  startTime?: string;
}>;

export type QuayDeparturesQuery = CursoredQuery<{
  id: string;
}>;

export type StopPlaceMetadata = CursoredData<StopPlaceDetails[]>;

const BASE_URL = 'bff/v1/stops/nearest';
const BASE_URL_V2 = 'bff/v2/departures';

export async function getNearestStops(
  query: StopsNearestQuery,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceDetails[]> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}?${queryString}`;
  return request(url, opts);
}

export async function getStopPlaceDepartures(
  query: StopPlaceDeparturesQuery,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceQuayDepartures> {
  const url = `${BASE_URL_V2}/stop-departures`;
  return requestStopPlaceDepartures(stringifyUrl({url, query}), opts);
}

export async function getQuayDepartures(
  query: QuayDeparturesQuery,
  opts?: AxiosRequestConfig,
): Promise<EstimatedCall[]> {
  const url = `${BASE_URL_V2}/quay/${query.id}/departures`;
  return requestDepartures(url, opts);
}

async function request(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceDetails[]> {
  const response = await client.get<StopPlaceDetails[]>(url, opts);
  return response.data;
}

async function requestDepartures(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<EstimatedCall[]> {
  const response = await client.get<EstimatedCall[]>(url, opts);
  return response.data;
}

async function requestStopPlaceDepartures(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceQuayDepartures> {
  const response = await client.get<StopPlaceQuayDepartures>(url, opts);
  return response.data;
}
