import {API_BASE_URL} from '@env';
import {createClient} from '@atb/api/client';
import type {OfferFromLegsResponse} from './types/sales';
import type {OfferSearchParams} from '@atb/modules/ticketing';

export const client = createClient(API_BASE_URL);

export async function searchTripPatternOffers(params: OfferSearchParams) {
  const response = await client.post<OfferFromLegsResponse>(
    '/sales/v1/search/trip-pattern',
    params,
    {authWithIdToken: true},
  );

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return response.data;
}
