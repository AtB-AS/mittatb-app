import {API_BASE_URL} from '@env';
import {createClient} from '@atb/api/client';
import type {
  SalesTripPatternLeg,
  OfferFromLegsResponse,
  Traveller,
} from './types/sales';

export const client = createClient(API_BASE_URL);
const tripPatternEndpoint = `/sales/v1/search/trip-pattern`;

export async function fetchOfferFromLegs(
  travelDate: Date,
  legs: SalesTripPatternLeg[],
  travellers: Traveller[],
  products: string[],
) {
  const requestBody = {
    travellers,
    travelDate: travelDate.toISOString(),
    products,
    legs: legs.map((leg) => ({
      fromStopPlaceId: leg.fromStopPlaceId,
      toStopPlaceId: leg.toStopPlaceId,
      serviceJourneyId: leg.serviceJourneyId,
      mode: leg.mode,
      travelDate: leg.expectedStartTime.split('T')[0],
    })),
    isOnBehalfOf: false,
  };
  const response = await client.post<OfferFromLegsResponse>(
    tripPatternEndpoint,
    requestBody,
    {authWithIdToken: true},
  );

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return response.data;
}
