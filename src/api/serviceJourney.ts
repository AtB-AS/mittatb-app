import {formatISO} from 'date-fns';
import {EstimatedCall, ServiceJourneyMapInfoData} from '../sdk';
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

export async function getServiceJourneyMapLegs(
  id: string,
  currentQuayId?: string,
): Promise<ServiceJourneyMapInfoData> {
  let url = `bff/v1/servicejourney/${encodeURIComponent(id)}/polyline`;
  if (currentQuayId) {
    url = url + `?currentQuayId=${encodeURIComponent(currentQuayId)}`;
  }
  const response = await client.get<ServiceJourneyMapInfoData>(url);
  return (
    response.data ?? {
      mapLegs: [],
    }
  );
}
