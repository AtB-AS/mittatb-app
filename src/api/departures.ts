import {
  DeparturesMetadata,
  DeparturesWithStop,
  DeparturesRealtimeData,
  PaginationInput,
} from '../sdk';
import client from './client';
import {Location} from '../favorites/types';
import {AxiosRequestConfig} from 'axios';

export type DepartureQuery = Partial<PaginationInput> & {
  limit?: number;
};
export async function getDepartures(
  location: Location,
  query: DepartureQuery = {},
  opts?: AxiosRequestConfig,
): Promise<DeparturesMetadata> {
  const {limit = 5, pageOffset = 0, pageSize = 2} = query;
  let url = `bff/v1/departures-from-location-paging?limit=${limit}&pageSize=${pageSize}&pageOffset=${pageOffset}`;
  const response = await client.post<DeparturesMetadata>(url, location, opts);
  return response.data;
}

export async function getRealtimeDeparture(
  stops: DeparturesWithStop[],
  opts?: AxiosRequestConfig,
): Promise<DeparturesRealtimeData> {
  const quayIds = flatMap(stops, (s) => Object.keys(s.quays));
  const lineIds = flatMap(stops, (s) =>
    flatMap(Object.values(s.quays), (q) =>
      q.departures.map((d) => d.serviceJourney.journeyPattern!.line.id),
    ),
  );

  let url = `bff/v1/departures-realtime`;
  const response = await client.post<DeparturesRealtimeData>(
    url,
    {
      quayIds,
      lineIds,
    },
    opts,
  );
  return response.data;
}

function flatMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => U[],
): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}
