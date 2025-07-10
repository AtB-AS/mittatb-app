import {AxiosRequestConfig} from 'axios';
import {CursoredQuery} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import {client} from '../client';
import {UserFavoriteDepartures} from '@atb/modules/favorites';
import {NearestStopPlacesQuery} from '../types/generated/NearestStopPlacesQuery';
import {StopsDetailsQuery} from '../types/generated/StopsDetailsQuery';
import queryString from 'query-string';
import {DeparturesQuery} from '../types/generated/DeparturesQuery';
import {DeparturesWithLineName} from './types';

type StopsNearestQuery = CursoredQuery<{
  latitude: number;
  longitude: number;
  count?: number;
  distance?: number;
  after?: string;
}>;
export async function getNearestStops(
  query: StopsNearestQuery,
  opts?: AxiosRequestConfig,
): Promise<NearestStopPlacesQuery> {
  const queryString = stringifyWithDate(query);
  const url = `bff/v2/departures/stops-nearest?${queryString}`;
  const response = await client.get<NearestStopPlacesQuery>(url, opts);
  return response.data;
}

type StopsDetailsVariables = CursoredQuery<{
  ids: string[];
}>;
export async function getStopsDetails(
  query: StopsDetailsVariables,
  opts?: AxiosRequestConfig,
): Promise<StopsDetailsQuery> {
  const url = `bff/v2/departures/stops-details`;
  const urlWithQuery = queryString.stringifyUrl({url, query});
  const response = await client.get<StopsDetailsQuery>(urlWithQuery, opts);
  return response.data;
}

export type DeparturesVariables = {
  ids: string[];
  numberOfDepartures: number;
  startTime: string;
  timeRange?: number;
  limitPerLine?: number;
};
export async function getDepartures(
  query: DeparturesVariables,
  favorites?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<DeparturesWithLineName> {
  const queryString = stringifyWithDate(query);
  const url = `bff/v2/departures/departures?${queryString}`;
  const response = await client.post<DeparturesQuery>(url, {favorites}, opts);
  return response.data;
}
