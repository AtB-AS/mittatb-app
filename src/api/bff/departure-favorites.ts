import {AxiosRequestConfig} from 'axios';
import {build} from 'search-params';
import {
  FavoriteDeparture,
  UserFavoriteDepartures,
} from '@atb/modules/favorites';
import {CursoredQuery} from '@atb/sdk';
import {client} from '../client';
import {DepartureGroupMetadata} from './types';

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
