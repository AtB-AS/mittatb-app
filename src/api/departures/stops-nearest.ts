import {AxiosRequestConfig} from 'axios';
import {CursoredData, CursoredQuery, StopPlace} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import client from '../client';

export type StopsNearestQuery = CursoredQuery<{
  lat: number;
  lon: number;
  distance?: number;
}>;

export type StopPlaceMetadata = CursoredData<StopPlace[]>;

const BASE_URL = 'bff/v1/stops/nearest';

export async function getNearestStops(
  query: StopsNearestQuery,
  opts?: AxiosRequestConfig,
): Promise<StopPlace[]> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}?${queryString}`;
  return request(url, opts);
}

async function request(
  url: string,
  opts?: AxiosRequestConfig,
): Promise<StopPlace[]> {
  const response = await client.get<StopPlace[]>(url, opts);
  return response.data;
}
