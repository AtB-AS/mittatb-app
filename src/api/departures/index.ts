import {AxiosRequestConfig} from 'axios';
import {build} from 'search-params';
import {Location} from '@atb/favorites/types';
import {
  DeparturesMetadata,
  DeparturesRealtimeData,
  PaginationInput,
  StopPlaceDetails,
} from '@atb/sdk';
import {flatMap} from '@atb/utils/array';
import client from '../client';
import {DepartureGroupsQuery} from './departure-group';
import {StopPlaceGroup} from './types';
import * as DepartureTypes from '@atb/api/types/departures';

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

export async function getRealtimeDeparture(
  stops: StopPlaceGroup[],
  query: DepartureGroupsQuery,
  opts?: AxiosRequestConfig,
): Promise<DeparturesRealtimeData> {
  const quayIds = flatMap(stops, (s) => s.quays.map((q) => q.quay.id));
  const startTime = query.startTime;

  const params = build({
    quayIds,
    startTime,
    limit: query.limitPerLine,
  });

  let url = `bff/v1/departures-realtime?${params}`;
  const response = await client.get<DeparturesRealtimeData>(url, opts);
  return response.data;
}

export async function getRealtimeDepartureV2(
  stop: StopPlaceDetails | undefined,
  query: DepartureGroupsQuery,
  opts?: AxiosRequestConfig,
): Promise<DeparturesRealtimeData> {
  if (!stop || !stop.quays) return {};

  const quayIds: string[] = stop.quays.map((q) => q.id);
  const startTime = query.startTime;

  const params = build({
    quayIds,
    startTime,
    limit: query.limitPerLine,
  });

  let url = `bff/v2/departures/realtime?${params}`;
  const response = await client.get<DeparturesRealtimeData>(url, opts);
  return response.data;
}

export {getDepartureGroups} from './departure-group';
