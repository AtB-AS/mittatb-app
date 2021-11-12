import {AxiosRequestConfig} from 'axios';
import {
  CursoredData,
  CursoredQuery,
  StopPlace,
  StopPlaceDetails,
  StopPlaceDetailsWithEstimatedCalls,
} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import client from '../client';
import {FavoriteDeparture} from '@atb/favorites/types';
import {EstimatedCall} from '@entur/sdk';

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
  id: string;
}>;

export type StopPlaceMetadata = CursoredData<StopPlaceDetails[]>;

const BASE_URL = 'bff/v1/stops/nearest';
const BASE_URL_V2 = 'bff/v1/stop';

export async function getNearestStops(
  query: StopsNearestQuery,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceDetails[]> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}?${queryString}`;
  return request(url, opts);
}

export async function getStopPlaceDepartures(
  // payload: StopPlaceDeparturesPayload,
  query: StopPlaceDeparturesQuery,
  opts?: AxiosRequestConfig,
): Promise<EstimatedCall[]> {
  // TODO: Depreciated endpoint
  const url = `${BASE_URL_V2}/${query.id}/departures`;
  return requestStopPlaceDepartures(url, opts);
}

async function request(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<StopPlaceDetails[]> {
  const response = await client.get<StopPlaceDetails[]>(url, opts);
  return response.data;
}

async function requestStopPlaceDepartures(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<EstimatedCall[]> {
  const response = await client.get<EstimatedCall[]>(url, opts);
  return response.data;
}
