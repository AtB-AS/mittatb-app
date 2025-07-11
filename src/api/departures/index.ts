import {AxiosRequestConfig} from 'axios';
import {build} from 'search-params';
import {
  FavoriteDeparture,
  UserFavoriteDepartures,
} from '@atb/modules/favorites';
import {CursoredQuery, DeparturesRealtimeData} from '@atb/sdk';
import {flatMap} from '@atb/utils/array';
import {onlyUniques} from '@atb/utils/only-uniques';
import {client} from '../client';
import {DepartureGroupMetadata, StopPlaceGroup} from './types';
import {isDefined} from '@atb/utils/presence';

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

export type DepartureFavoritesQuery = CursoredQuery<{
  startTime: string;
  limitPerLine: number;
  includeCancelledTrips?: boolean;
}>;
export async function getFavouriteDepartures(
  favourites: UserFavoriteDepartures,
  query: DepartureFavoritesQuery,
  opts?: AxiosRequestConfig,
): Promise<DepartureGroupMetadata | null> {
  if (!favourites || favourites.length === 0) return null;

  const params = build(query);
  const url = `/bff/v2/departure-favorites?${params}`;

  const favorites: FavoriteDeparture[] = favourites.map((f) => ({
    lineId: f.lineId,
    quayId: f.quayId,
    quayName: f.quayName,
    lineLineNumber: f.lineLineNumber,
    destinationDisplay: f.destinationDisplay,
    lineTransportationMode: f.lineTransportationMode,
    lineTransportationSubMode: f.lineTransportationSubMode,
    quayPublicCode: f.quayPublicCode,
  }));

  const response = await client.post<DepartureGroupMetadata>(
    url,
    {favorites},
    opts,
  );
  return response.data;
}
