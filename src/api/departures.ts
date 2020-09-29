import {
  DeparturesMetadata,
  DeparturesWithStop,
  DeparturesRealtimeData,
  PaginationInput,
} from '../sdk';
import client from './client';
import {Location} from '../favorites/types';
import {AxiosRequestConfig} from 'axios';
import {build} from 'search-params';
import {flatMap} from '../utils/array';

export type DeparturesInputQuery = {
  numberOfDepartures: number; // Number of departures to fetch per quay.
  startTime: Date;
};
export type DepartureQuery = Partial<PaginationInput> & DeparturesInputQuery;

export async function getDepartures(
  location: Location,
  query: DepartureQuery,
  opts?: AxiosRequestConfig,
): Promise<DeparturesMetadata> {
  const {numberOfDepartures, pageOffset = 0, pageSize = 2} = query;
  const startTime = query.startTime.toISOString();
  let url = `bff/v1/departures-from-location-paging?limit=${numberOfDepartures}&pageSize=${pageSize}&pageOffset=${pageOffset}&startTime=${startTime}`;
  const response = await client.post<DeparturesMetadata>(url, location, opts);
  return response.data;
}

export async function getRealtimeDeparture(
  stops: DeparturesWithStop[],
  query: DeparturesInputQuery,
  opts?: AxiosRequestConfig,
): Promise<DeparturesRealtimeData> {
  const quayIds = flatMap(stops, (s) => Object.keys(s.quays));
  const startTime = query.startTime.toISOString();

  const params = build({
    quayIds,
    startTime,
    limit: query.numberOfDepartures,
  });

  let url = `bff/v1/departures-realtime?${params}`;
  const response = await client.get<DeparturesRealtimeData>(url, opts);
  return response.data;
}
