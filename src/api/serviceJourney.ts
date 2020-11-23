import {formatISO} from 'date-fns';
import {EstimatedCall} from '../sdk';
import client from './client';

type ServiceJourneDepartures = {
  value: EstimatedCall[];
};

export async function getDepartures(
  id: string,
  date?: Date,
): Promise<EstimatedCall[]> {
  let url = `bff/v1/servicejourney/${encodeURIComponent(id)}/departures`;
  if (date) {
    url = url + `?date=${formatISO(date, {representation: 'date'})}`;
  }
  const response = await client.get<ServiceJourneDepartures>(url);
  return response.data?.value ?? [];
}
