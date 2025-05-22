import {API_BASE_URL} from '@env';
import {createClient} from '@atb/api/client';
import type {
  SalesTripPatternLeg,
  OfferFromLegsResponse,
  Traveller,
} from './types/sales';

export const client = createClient(API_BASE_URL);
const tripPatternEndpoint = `/sales/v1/search/trip-pattern`;

// TODO: Should this be a combined function for multiple offers?
export async function fetchOfferFromLegs(
  travel_date: Date,
  legs: SalesTripPatternLeg[],
  travellers: Traveller[],
  products: string[],
) {
  const requestBody = {
    travellers,
    travelDate: travel_date.toISOString(),
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
    console.log('An error occured while fetching the offer');
    throw new Error(response.statusText);
  }

  return response.data;
}
