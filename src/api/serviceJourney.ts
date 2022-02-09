import {formatISO} from 'date-fns';
import {EstimatedCall, ServiceJourneyMapInfoData} from '../sdk';
import client from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';

type ServiceJourneyDepartures = {
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
  const response = await client.get<ServiceJourneyDepartures>(url, {
    baseURL: 'http://10.0.2.2:8080',
  });
  return response.data?.value ?? [];
}

export async function getServiceJourneyMapLegs(
  id: string,
  fromQuayId?: string,
  toQuayId?: string,
): Promise<ServiceJourneyMapInfoData> {
  const url = `bff/v1/servicejourney/${encodeURIComponent(id)}/polyline`;
  const query = qs.stringify(
    {
      fromQuayId,
      toQuayId,
    },
    {skipNull: true},
  );
  const response = await client.get<ServiceJourneyMapInfoData>(
    stringifyUrl(url, query),
  );
  return (
    response.data ?? {
      mapLegs: [],
    }
  );
}
