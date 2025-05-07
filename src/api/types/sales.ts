import type {UserProfile} from '@atb-as/config-specs';

export type SalesTripPatternLeg = {
  expectedStartTime: string;
  fromStopPlaceId: string;
  toStopPlaceId: string;
  serviceJourneyId: string;
  mode: string;
};

export type Traveller = {
  id: string;
  userType: UserProfile['userTypeString'];
};

export type SalesOffer = {
  offerId: string;
  travellerId: string;
  price: {
    amount: string;
    currency: string;
  };
  fareProduct: string;
  validFrom: string;
  validTo: string;
  route: {
    type: 'Zonal' | 'PointToPoint' | 'NonGeographic';
    from?: string;
    to?: string;
  };
  shouldStartNow: boolean;
  available: number | null;
};

export type OfferFromLegsResponse = {
  offers: SalesOffer[];
  cheapestTotalPrice: number;
};
