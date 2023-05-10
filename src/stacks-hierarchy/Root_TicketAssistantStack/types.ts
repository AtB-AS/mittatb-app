import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';

export type Traveller = {
  id: string;
  userType: string;
};
export type InputParams = {
  frequency?: number;
  duration?: number;
  traveller?: Traveller;
  zones?: string[];
};

export type TicketResponseData = {
  productId: string;
  fareProduct: string;
  duration: number;
  quantity: number;
  price: number;
  traveller: {id: string; userType: string};
};

export type RecommendedTicketResponse = {
  totalCost: number;
  tickets: TicketResponseData[];
  zones: string[];
  singleTicketPrice: number;
};

export type RecommendedTicketSummary = {
  tariffZones: TariffZoneWithMetadata[];
  userProfileWithCount: UserProfileWithCount[];
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  ticket: TicketResponseData;
  singleTicketPrice: number;
};
