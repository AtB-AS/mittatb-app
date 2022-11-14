import {formatISO} from 'date-fns';
import client from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';
import {ServiceJourneyMapInfoData_v3} from '@atb/api/types/serviceJourney';
import {ServiceJourneyEstimatedCallFragment} from './types/generated/serviceJourney';

type ServiceJourneyDepartures = {
  value: ServiceJourneyEstimatedCallFragment[];
};

export async function getDepartures(
  id: string,
  date?: Date,
): Promise<ServiceJourneyEstimatedCallFragment[]> {
  let url = `bff/v2/servicejourney/${encodeURIComponent(id)}/departures`;
  if (date) {
    url = url + `?date=${formatISO(date, {representation: 'date'})}`;
  }
  const response = await client.get<ServiceJourneyDepartures>(url);
  return response.data?.value ?? [];
}

export async function getServiceJourneyMapLegs(
  id: string,
  fromQuayId?: string,
  toQuayId?: string,
): Promise<ServiceJourneyMapInfoData_v3> {
  const url = `bff/v2/servicejourney/${encodeURIComponent(id)}/polyline`;
  const query = qs.stringify(
    {
      fromQuayId,
      toQuayId,
    },
    {skipNull: true},
  );
  const response = await client.get<ServiceJourneyMapInfoData_v3>(
    stringifyUrl(url, query),
  );
  return (
    response.data ?? {
      mapLegs: [],
    }
  );
}
