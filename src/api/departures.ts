import {Coordinates, EstimatedCall} from '../sdk';
import {getClient} from './client';

export async function getNearestDepartures(
  coords: Coordinates,
): Promise<EstimatedCall[]> {
  let url = `v1/departures/nearest?lat=${coords.latitude}&lon=${coords.longitude}`;
  console.log(url);
  const client = await getClient();
  const response = await client.get<EstimatedCall[]>(url);
  return response.data ?? [];
}
