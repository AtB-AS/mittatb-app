import {AxiosRequestConfig} from 'axios';
import {FavoriteDeparture} from '@atb/favorites';
import {CursoredData, CursoredQuery} from '@atb/sdk';
import {stringifyWithDate} from '@atb/utils/querystring';
import {client} from '../client';
import {StopPlaceGroup} from './types';

export type DepartureGroupsPayload = {
  location: DepartureGroupsPayloadLocation;
  favorites?: FavoriteDeparture[];
};

export type DepartureGroupsPayloadLocation =
  | {
      layer: 'address';
      coordinates: {longitude: number; latitude: number};
    }
  | {
      layer: 'venue';
      id: string;
    };

export type DepartureGroupsQuery = CursoredQuery<{
  startTime: string;
  limitPerLine: number;
}>;

export type DepartureRealtimeQuery = {
  quayIds: string[];
  startTime: string;
  limit: number;
  limitPerLine?: number;
  lineIds?: string[];
  timeRange?: number;
};

export type DepartureFavoritesQuery = CursoredQuery<{
  startTime: string;
  limitPerLine: number;
  includeCancelledTrips?: boolean;
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
  const response = await client.post<DepartureGroupMetadata>(
    url,
    payload,
    opts,
  );
  return response.data;
}
