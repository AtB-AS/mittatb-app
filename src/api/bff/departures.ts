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
import {NearestStopPlaceNode} from '../types/departures';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';

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
export async function getDeparturesRealtime(
  query?: DepartureRealtimeQuery,
  belongsToDeparturesQueryKey?: string,
  opts?: AxiosRequestConfig,
): Promise<DeparturesRealtimeData & {belongsToDeparturesQueryKey?: string}> {
  if (!query || query.quayIds.length === 0) return Promise.resolve({});

  const params = build({
    ...query,
    quayIds: query.quayIds.filter(onlyUniques),
    lineIds: query.lineIds?.filter(onlyUniques),
  });
  const url = `bff/v2/departures/realtime?${params}`;

  const response = await client.get<DeparturesRealtimeData>(url, opts);
  return Object.assign({...response.data, belongsToDeparturesQueryKey});
}

export async function getNearestStopPlaceNodes(
  query?: NearestStopPlacesQueryVariables,
  opts?: AxiosRequestConfig,
): Promise<NearestStopPlaceNode[] | null> {
  if (!query) return Promise.resolve(null);
  const queryString = stringifyWithDate(query);
  const url = `bff/v2/departures/stops-nearest?${queryString}`;
  const response = await client.get<NearestStopPlacesQuery>(url, opts);

  const nearestStopPlaceNodes =
    response?.data?.nearest?.edges
      // Cast to NearestStopPlaceNode, as it is the only possible type returned from bff
      ?.map((e) => e.node as NearestStopPlaceNode)
      .filter((n): n is NearestStopPlaceNode => !!n) || [];

  return sortAndFilterStopPlaces(nearestStopPlaceNodes);
}

function sortAndFilterStopPlaces(
  data?: NearestStopPlaceNode[],
): NearestStopPlaceNode[] {
  if (!data) return [];

  // Sort StopPlaces on distance from search location
  const sortedNodes = [...data]?.sort((n1, n2) => {
    if (n1.distance === undefined) return 1;
    if (n2.distance === undefined) return -1;
    return n1.distance > n2.distance ? 1 : -1;
  });

  // Remove all StopPlaces without Quays
  return sortedNodes.filter((n) => n.place?.quays?.length);
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
  mode: StopPlacesMode,
  favorites?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<
  | (DeparturesWithLineName & {
      query: DeparturesVariables;
      mode: StopPlacesMode;
      favorites?: UserFavoriteDepartures;
    })
  | null
> {
  if (!query || query.ids.length === 0) return Promise.resolve(null);
  const queryString = stringifyWithDate(query);
  const url = `bff/v2/departures/departures?${queryString}`;
  const response = await client.post<DeparturesQuery>(url, {favorites}, opts);
  return {...response.data, ...{query, mode, favorites}};
}
