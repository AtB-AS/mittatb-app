import {Coordinates, EstimatedCall} from '../sdk';
import client from './client';

export async function getNearestDepartures(
  coords: Coordinates,
): Promise<EstimatedCall[]> {
  let url = `v1/departures/nearest?lat=${coords.latitude}&lon=${coords.longitude}`;
  const response = await client.get<EstimatedCall[]>(url);
  return response.data ?? [];
}

export async function getDeparturesFromStop(
  stopId: string,
): Promise<EstimatedCall[]> {
  let url = `/v1/stop/${stopId}/departures`;
  const response = await client.get<EstimatedCall[]>(url);
  return response.data ?? [];
}
