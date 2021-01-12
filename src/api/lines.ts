import {FavoriteDeparture} from '../sdk';
import client from './client';

export type StopPlaceLine = {};

export async function fetchLinesOnStopPlace(
  stopPlaceId: string,
): Promise<StopPlaceLine> {
  console.log(stopPlaceId);
  return [];
  // let url = `bff/v1/lines-from-stopplace/${encodeURIComponent(stopPlaceId)}`;
  // const response = await client.get(url);
  // return response.data?.value ?? [];
}
