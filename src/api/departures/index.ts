import {AxiosRequestConfig} from 'axios';
import {build} from 'search-params';
import {
  FavoriteDeparture,
  Location,
  UserFavoriteDepartures,
} from '@atb/favorites/types';
import {
  DeparturesMetadata,
  DeparturesRealtimeData,
  PaginationInput,
} from '@atb/sdk';
import {flatMap} from '@atb/utils/array';
import {onlyUniques} from '@atb/utils/only-uniques';
import client from '../client';
import {
  DepartureFavoritesQuery,
  DepartureGroupMetadata,
  DepartureRealtimeQuery,
} from './departure-group';
import {StopPlaceGroup} from './types';

export type DeparturesInputQuery = {
  numberOfDepartures: number; // Number of departures to fetch per quay.
  startTime: string;
};
export type DepartureQuery = Partial<PaginationInput> & DeparturesInputQuery;

export async function getDepartures(
  location: Location,
  query: DepartureQuery,
  opts?: AxiosRequestConfig,
): Promise<DeparturesMetadata> {
  const {numberOfDepartures, pageOffset = 0, pageSize = 2} = query;
  const startTime = query.startTime;
  let url = `bff/v1/departures-from-location-paging?limit=${numberOfDepartures}&pageSize=${pageSize}&pageOffset=${pageOffset}&startTime=${startTime}`;
  const response = await client.post<DeparturesMetadata>(url, location, opts);
  return response.data;
}

type StopPlaceGroupRealtimeParams = {
  startTime: string;
  limitPerLine: number;
  lineIds?: string[];
  limit?: number;
};
export async function getStopPlaceGroupRealtime(
  stops: StopPlaceGroup[],
  query: StopPlaceGroupRealtimeParams,
  opts?: AxiosRequestConfig,
): Promise<DeparturesRealtimeData> {
  const quayIds = flatMap(stops, (stopPlaceGroup) =>
    flatMap(stopPlaceGroup.quays, (quayGroup) =>
      quayGroup.group.map((y) => y.lineInfo?.quayId),
    ),
  ).filter(Boolean) as string[];
  return getRealtimeDepartures(
    {
      ...query,
      quayIds,
      limit: query.limit ?? 100,
    },
    opts,
  );
}

export async function getRealtimeDepartures(
  query: DepartureRealtimeQuery,
  opts?: AxiosRequestConfig,
): Promise<DeparturesRealtimeData> {
  if (query.quayIds.length === 0) return {};

  const params = build({
    ...query,
    quayIds: query.quayIds.filter(onlyUniques),
    lineIds: query.lineIds?.filter(onlyUniques),
  });
  const url = `bff/v2/departures/realtime?${params}`;

  const response = await client.get<DeparturesRealtimeData>(url, opts);
  return response.data;
}

export async function getFavouriteDepartures(
  favourites: UserFavoriteDepartures,
  query: DepartureFavoritesQuery,
  opts?: AxiosRequestConfig,
): Promise<DepartureGroupMetadata | null> {
  if (!favourites || favourites.length === 0) {
    return null;
  }

  const params = build(query);

  const favorites: FavoriteDeparture[] = favourites.map((f) => ({
    lineId: f.lineId,
    quayId: f.quayId,
    quayName: f.quayName,
    stopId: f.stopId,
    lineLineNumber: f.lineLineNumber,
    lineName: f.lineName,
    lineTransportationMode: f.lineTransportationMode,
    lineTransportationSubMode: f.lineTransportationSubMode,
    quayPublicCode: f.quayPublicCode,
  }));

  const url = `/bff/v2/departure-favorites?${params}`;
  return await post<DepartureGroupMetadata>(
    url,
    {favorites: favorites},
    {...opts},
  );
}

async function post<T>(
  url: string,
  query: any,
  opts?: AxiosRequestConfig<any>,
) {
  const response = await client.post<T>(url, query, {
    ...opts,
  });

  return response.data;
}

export {getDepartureGroups} from './departure-group';
