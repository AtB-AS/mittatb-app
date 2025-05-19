import {AxiosRequestConfig} from 'axios';
import {CursoredQuery} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import {client} from '../client';
import {
  FavoriteDeparture,
  UserFavoriteDepartures,
} from '@atb/modules/favorites';
import {NearestStopPlacesQuery} from '../types/generated/NearestStopPlacesQuery';
import {StopsDetailsQuery} from '../types/generated/StopsDetailsQuery';
import queryString from 'query-string';
import {DeparturesQuery} from '../types/generated/DeparturesQuery';
import {DeparturesWithLineName} from './types';

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

export type DeparturesPayload = {
  favorites?: FavoriteDeparture[];
};

export type DeparturesVariables = {
  ids: string[];
  numberOfDepartures: number;
  startTime: string;
  timeRange?: number;
  limitPerLine?: number;
};

const BASE_URL = 'bff/v2/departures';

export async function getNearestStops(
  query: StopsNearestQuery,
  opts?: AxiosRequestConfig,
): Promise<NearestStopPlacesQuery> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}/stops-nearest?${queryString}`;
  return requestNearestStops(url, opts);
}

export async function getStopsDetails(
  query: StopsDetailsVariables,
  opts?: AxiosRequestConfig,
): Promise<StopsDetailsQuery> {
  const url = `${BASE_URL}/stops-details`;
  return requestStopsDetails(queryString.stringifyUrl({url, query}), opts);
}

export async function getDepartures(
  query: DeparturesVariables,
  favorites?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<DeparturesWithLineName> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}/departures?${queryString}`;
  return requestDepartures(url, {favorites}, opts);
}

async function requestNearestStops(
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

async function requestDepartures(
  url: string,
  payload: DeparturesPayload,
  opts?: AxiosRequestConfig,
): Promise<DeparturesQuery> {
  const response = await client.post<DeparturesQuery>(url, payload, opts);
  return response.data;
}
