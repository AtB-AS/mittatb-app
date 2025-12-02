import {AxiosRequestConfig} from 'axios';
import {build} from 'search-params';
import {UserFavoriteDepartures} from '@atb/modules/favorites';
import {CursoredQuery} from './types';
import {flatMap} from '@atb/utils/array';
import {onlyUniques} from '@atb/utils/only-uniques';
import {client} from '../client';
import {StopPlaceGroup} from './types';
import {isDefined} from '@atb/utils/presence';
import {stringifyWithDate} from '@atb/utils/querystring';
import {
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables,
} from '../types/generated/NearestStopPlacesQuery';
import {StopsDetailsQuery} from '../types/generated/StopsDetailsQuery';
import queryString from 'query-string';
import {DeparturesQuery} from '../types/generated/DeparturesQuery';
import {DeparturesWithLineName} from './types';

export type RealtimeData = {
  serviceJourneyId: string;
  timeData: {
    realtime: boolean;
    expectedDepartureTime: string;
    aimedDepartureTime: string;
  };
};
export type DepartureRealtimeData = {
  quayId: string;
  departures: {[serviceJourneyId: string]: RealtimeData};
};
export type DeparturesRealtimeData = {
  [quayId: string]: DepartureRealtimeData;
};

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
  ).filter(isDefined);
  if (quayIds.length === 0) return {};

  const params = build({
    ...query,
    limit: query.limit ?? 100,
    quayIds: quayIds.filter(onlyUniques),
    lineIds: query.lineIds?.filter(onlyUniques),
  });
  const url = `bff/v2/departures/realtime?${params}`;

  const response = await client.get<DeparturesRealtimeData>(url, opts);
  return response.data;
}

export type DepartureRealtimeQuery = {
  quayIds: string[];
  startTime: string;
  limit: number;
  limitPerLine?: number;
  lineIds?: string[];
  timeRange?: number;
};
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

export async function getNearestStopPlaces(
  query?: NearestStopPlacesQueryVariables,
  opts?: AxiosRequestConfig,
): Promise<NearestStopPlacesQuery | null> {
  if (!query) return Promise.resolve(null);
  const queryString = stringifyWithDate(query);
  const url = `bff/v2/departures/stops-nearest?${queryString}`;
  const response = await client.get<NearestStopPlacesQuery>(url, opts);
  return response.data ?? null;
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
