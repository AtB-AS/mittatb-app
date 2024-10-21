import {client} from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';
import {ServiceJourneyMapInfoData_v3} from '@atb/api/types/serviceJourney';
import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';

/**
 * @param id Service Journey ID
 * @param serviceDate Service Journey date on the format "YYYY-MM-DD"
 */
export async function getServiceJourneyWithEstimatedCalls(
  id: string,
  serviceDate: string,
): Promise<ServiceJourneyWithEstCallsFragment> {
  const encodedId = encodeURIComponent(id);
  const url = `bff/v2/servicejourney/${encodedId}/calls?date=${serviceDate}`;
  const response = await client.get<{
    value: ServiceJourneyWithEstCallsFragment;
  }>(url);
  return response.data?.value;
}

export async function getServiceJourneyMapLegs(
  id: string,
  fromQuayId: string,
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
