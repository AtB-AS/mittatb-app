import {AxiosRequestConfig} from 'axios';
import {FavoriteDeparture} from '@atb/favorites/types';
import {CursoredData, CursoredQuery} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import client from '../client';
import {StopPlaceGroup} from './types';

export type DepartureGroupsPayload = {
  location:
    | {
        layer: 'address';
        coordinates: {longitude: number; latitude: number};
      }
    | {
        layer: 'venue';
        id: string;
      };
  favorites?: FavoriteDeparture[];
};

export type DepartureGroupsQuery = CursoredQuery<{
  startTime: string;
  limitPerLine: number;
}>;

export type DepartureGroupMetadata = CursoredData<StopPlaceGroup[]>;

const BASE_URL = 'bff/v1/departures-grouped';

export async function getDepartureGroups(
  payload: DepartureGroupsPayload,
  query: DepartureGroupsQuery,
  opts?: AxiosRequestConfig,
): Promise<DepartureGroupMetadata> {
  const queryString = stringifyWithDate(query);
  const url = `${BASE_URL}?${queryString}`;
  return request(url, payload, opts);
}

export async function getNextDepartureGroups(
  payload: DepartureGroupsPayload,
  cursorInfo: CursoredData<unknown>['metadata'],
  opts?: AxiosRequestConfig,
): Promise<DepartureGroupMetadata | undefined> {
  if (!cursorInfo.hasNextPage) {
    return undefined;
  }

  const queryString = cursorInfo.nextUrlParams;
  const url = `${BASE_URL}?${queryString}`;
  return request(url, payload, opts);
}

async function request(
  url: string,
  payload: DepartureGroupsPayload,
  opts?: AxiosRequestConfig,
): Promise<DepartureGroupMetadata> {
  const response = await client.post<DepartureGroupMetadata>(url, payload, {
    ...opts,
    baseURL: 'http://10.0.2.2:8080',
  });
  return response.data;
}
