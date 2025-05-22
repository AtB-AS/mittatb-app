import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {PreassignedFareProduct} from '@atb/modules/configuration';
import {
  FlexDiscountLadder,
  Offer,
  OfferPrice,
  searchOffers,
} from '@atb/modules/ticketing';
import {useCallback} from 'react';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {secondsBetween} from '@atb/utils/date';
import {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {fetchOfferFromLegs} from '@atb/api/sales';
import {useMutation} from '@tanstack/react-query';

export type UserProfileWithCountAndOffer = UserProfileWithCount & {
  offer: Offer;
};

export type OfferError = {
  type: ErrorType | 'empty-offers' | 'not-available';
};

type OfferState = {
  offerSearchTime?: number;
  isSearchingOffer: boolean;
  validDurationSeconds?: number;
  originalPrice: number;
  totalPrice: number;
  error?: OfferError;
  userProfilesWithCountAndOffer: UserProfileWithCountAndOffer[];
  flexDiscountLadder?: FlexDiscountLadder;
};

const getCurrencyAsFloat = (price: OfferPrice, currency = 'NOK') =>
  price.currency === currency ? price.amountFloat ?? 0 : 0;

const getOriginalPriceAsFloat = (price: OfferPrice, currency: string) =>
  price.currency === currency ? price.originalAmountFloat ?? 0 : 0;

const getValidDurationSeconds = (offer: Offer): number | undefined =>
  offer.validFrom && offer.validTo
    ? secondsBetween(offer.validFrom, offer.validTo)
    : undefined;

const getOfferForTraveller = (offers: Offer[], userTypeString: string) => {
  const offersForTraveller = offers.filter(
    (o) => o.travellerId === userTypeString,
  );

  // If there are multiple offers for the same traveller, use the cheapest one.
  // This shouldn't happen in practice, but it's a sensible fallback.
  const offersSortedByPrice = offersForTraveller.sort(
    (a, b) =>
      getCurrencyAsFloat(a.price, 'NOK') - getCurrencyAsFloat(b.price, 'NOK'),
  );

  return offersSortedByPrice[0];
};

const calculateTotalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: Offer[],
) =>
  userProfileWithCounts.reduce((total, traveller) => {
    const offer = getOfferForTraveller(offers, traveller.userTypeString);
    const price = offer
      ? getCurrencyAsFloat(offer.price, 'NOK') * traveller.count
      : 0;
    return total + price;
  }, 0);

const calculateOriginalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: Offer[],
) =>
  userProfileWithCounts.reduce((total, traveller) => {
    const offer = getOfferForTraveller(offers, traveller.userTypeString);
    const price = offer
      ? getOriginalPriceAsFloat(offer.price, 'NOK') * traveller.count
      : 0;
    return total + price;
  }, 0);

const mapToUserProfilesWithCountAndOffer = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: Offer[],
): UserProfileWithCountAndOffer[] =>
  userProfileWithCounts
    .map((u) => ({
      ...u,
      offer: getOfferForTraveller(offers, u.userTypeString),
    }))
    .filter((u): u is UserProfileWithCountAndOffer => u.offer != null);

const initialState: OfferState = {
  isSearchingOffer: false,
  offerSearchTime: undefined,
  totalPrice: 0,
  originalPrice: 0,
  error: undefined,
  userProfilesWithCountAndOffer: [],
};

export function useOfferState(
  selection: PurchaseSelectionType,
  preassignedFareProductAlternatives: PreassignedFareProduct[],
  isOnBehalfOf: boolean = false,
) {
  const mapParamsForSearchOffers = () => ({
    zones: selection.zones && [
      ...new Set([selection.zones.from.id, selection.zones.to.id]),
    ],
    from: selection.stopPlaces?.from!.id,
    to: selection.stopPlaces?.to!.id,
    isOnBehalfOf,
    travellers: selection.userProfilesWithCount
      .filter((t) => t.count)
      .map((t) => ({
        id: t.userTypeString,
        userType: t.userTypeString,
        count: t.count,
      })),
    products: preassignedFareProductAlternatives.map((p) => p.id),
    travelDate: selection.travelDate,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (selection.stopPlaces?.to?.isFree) {
        return {offers: [], error: undefined};
      }

      const offerTravellers = selection.userProfilesWithCount
        .filter((t) => t.count)
        .map((t) => ({
          id: t.userTypeString,
          userType: t.userTypeString,
          count: t.count,
        }));

      const isTravellersValid = offerTravellers.length > 0;
      const isStopPlacesValid = selection.stopPlaces
        ? selection.stopPlaces.from && selection.stopPlaces.to
        : true;
      const isSelectionValid = isTravellersValid && isStopPlacesValid;

      if (!isSelectionValid) {
        return {offers: [], error: undefined};
      }

      try {
        let offers: Offer[];
        if (selection.legs.length) {
          const response = await fetchOfferFromLegs(
            new Date(selection.legs[0].expectedStartTime),
            selection.legs,
            offerTravellers,
            preassignedFareProductAlternatives.map((p) => p.id),
          );
          offers = response.offers;
        } else {
          const offerEndpoint = selection.stopPlaces
            ? 'stop-places'
            : selection.zones
            ? 'zones'
            : 'authority';

          offers = await searchOffers(
            offerEndpoint,
            mapParamsForSearchOffers(),
            {
              authWithIdToken: true,
              skipErrorLogging: isNotAvailableError,
            },
          );
        }

        if (offers.length) {
          return {offers, error: undefined};
        } else {
          return {offers: [], error: {type: 'empty-offers'}};
        }
      } catch (err: any) {
        const errorType = isNotAvailableError(err)
          ? 'not-available'
          : getAxiosErrorType(err);
        if (errorType !== 'cancel') {
          console.warn(err);
          return {offers: [], error: {type: errorType}};
        }
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('Offers successfully fetched:', data.offers);
    },
  });

  const refreshOffer = useCallback(async () => {
    await mutation.mutateAsync();
  }, [mutation]);

  const state = mutation.isLoading
    ? {
        ...initialState,
        isSearchingOffer: true,
      }
    : mutation.data
    ? {
        ...initialState,
        offerSearchTime: Date.now(),
        isSearchingOffer: false,
        validDurationSeconds: getValidDurationSeconds(
          mutation.data.offers?.[0],
        ),
        originalPrice: calculateOriginalPrice(
          selection.userProfilesWithCount,
          mutation.data.offers,
        ),
        totalPrice: calculateTotalPrice(
          selection.userProfilesWithCount,
          mutation.data.offers,
        ),
        userProfilesWithCountAndOffer: mapToUserProfilesWithCountAndOffer(
          selection.userProfilesWithCount,
          mutation.data.offers,
        ),
        error: mutation.data.error,
      }
    : initialState;

  return {
    ...state,
    refreshOffer,
  };
}

const isNotAvailableError = (err: any) =>
  err.response?.status === 404 &&
  err.response?.data.kind === 'NO_AVAILABLE_OFFERS_DUE_TO_SCHEDULE';
