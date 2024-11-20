import {AxiosRequestConfig} from 'axios';
import {build} from 'search-params';
import {FavoriteDeparture, UserFavoriteDepartures} from '@atb/favorites';
import {DeparturesRealtimeData} from '@atb/sdk';
import {flatMap} from '@atb/utils/array';
import {onlyUniques} from '@atb/utils/only-uniques';
import {client} from '../client';
import {
  DepartureFavoritesQuery,
  DepartureGroupMetadata,
  DepartureRealtimeQuery,
  StopPlaceGroup,
} from './types';

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
    destinationDisplay: f.destinationDisplay,
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
