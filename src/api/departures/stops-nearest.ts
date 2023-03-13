import {AxiosRequestConfig} from 'axios';
import {CursoredData, CursoredQuery, StopPlaceDetails} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import client from '../client';
import {FavoriteDeparture, UserFavoriteDepartures} from '@atb/favorites';
import {StopPlaceQuayDepartures} from '../types/departures';
import {QuayDeparturesQuery} from '../types/generated/QuayDeparturesQuery';
import {NearestStopPlacesQuery} from '../types/generated/NearestStopPlacesQuery';
import {StopsDetailsQuery} from '../types/generated/StopsDetailsQuery';
import {stringifyUrl} from 'query-string/base';

export type StopsNearestQuery = CursoredQuery<{
  latitude: number;
  longitude: number;
  count?: number;
  distance?: number;
  after?: string;
}>;

export type StopsDetailsVariables = CursoredQuery<{
  ids: string[];
}>;

export type StopPlaceDeparturesPayload = {
  location: {
    layer: 'venue';
    id: string;
  };
  favorites?: FavoriteDeparture[];
};

export type DeparturesPayload = {
  favorites?: FavoriteDeparture[];
};

export type StopPlaceDeparturesQuery = {
  id: string;
  numberOfDepartures: number;
  startTime: string;
  timeRange?: number;
  limitPerLine?: number;
};

export type QuayDeparturesVariables = {
  id: string;
  numberOfDepartures: number;
  startTime: string;
  timeRange?: number;
  limitPerLine?: number;
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

export async function getStopsDetails(
  query: StopsDetailsVariables,
  opts?: AxiosRequestConfig,
): Promise<StopsDetailsQuery> {
  const url = `${BASE_URL}/stops-details`;
  return requestStopsDetails(stringifyUrl({url, query}), opts);
}

export async function getStopPlaceDepartures(
  query: StopPlaceDeparturesQuery,
  favorites?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceQuayDepartures> {
  const url = `${BASE_URL}/stop-departures`;
  return requestStopPlaceDepartures(
    stringifyUrl({url, query}),
    {favorites},
    opts,
  );
}

export async function getQuayDepartures(
  query: QuayDeparturesVariables,
  favorites?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<QuayDeparturesQuery> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}/quay-departures?${queryString}`;
  return requestQuayDepartures(url, {favorites}, opts);
}

async function request(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<NearestStopPlacesQuery> {
  const response = await client.get<NearestStopPlacesQuery>(url, opts);
  return response.data;
}

async function requestStopsDetails(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<StopsDetailsQuery> {
  const response = await client.get<StopsDetailsQuery>(url, opts);
  return response.data;
}

async function requestQuayDepartures(
  url: string,
  payload: DeparturesPayload,
  opts?: AxiosRequestConfig,
): Promise<QuayDeparturesQuery> {
  const response = await client.post<QuayDeparturesQuery>(url, payload, opts);
  return response.data;
}

async function requestStopPlaceDepartures(
  url: string,
  payload: DeparturesPayload,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceQuayDepartures> {
  const response = await client.post<StopPlaceQuayDepartures>(
    url,
    payload,
    opts,
  );
  return response.data;
}
