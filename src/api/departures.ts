import {Coordinates, EstimatedCall, DeparturesWithStop} from '../sdk';
import client from './client';
import {Location} from '../favorites/types';
import {AxiosRequestConfig} from 'axios';

export async function getNearestDepartures(
  coords: Coordinates,
): Promise<EstimatedCall[]> {
  let url = `bff/v1/departures/nearest?lat=${coords.latitude}&lon=${coords.longitude}`;
  const response = await client.get<EstimatedCall[]>(url);
  return response.data ?? [];
}

export async function getDeparturesFromStop(
  stopId: string,
): Promise<EstimatedCall[]> {
  let url = `bff/v1/stop/${stopId}/departures`;
  const response = await client.get<EstimatedCall[]>(url);
  return response.data ?? [];
}

export async function getDepartures(
  location: Location,
  limit: number = 5,
  opts?: AxiosRequestConfig,
): Promise<DeparturesWithStop[]> {
  let url = `bff/v1/departures-from-location?limit=${limit}`;
  const response = await client.post<DeparturesWithStop[]>(url, location, opts);
  return response.data ?? [];
}
