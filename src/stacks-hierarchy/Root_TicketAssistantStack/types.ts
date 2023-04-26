import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';

export type Traveller = {
  id: string;
  user_type: string;
};
export type TicketAssistantData = {
  frequency: number;
  duration: number;
  traveller: Traveller;
  zones: string[];
  preassigned_fare_products: string[];
};

export type TicketResponseData = {
  product_id: string;
  fare_product: string;
  duration: number;
  quantity: number;
  price: number;
  traveller: {id: string; user_type: string};
};

export type RecommendedTicketResponse = {
  total_cost: number;
  tickets: TicketResponseData[];
  zones: string[];
  single_ticket_price: number;
};

export type PurchaseTicketDetails = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
};

export type PurchaseDetails = {
  tariffZones: TariffZoneWithMetadata[];
  userProfileWithCount: UserProfileWithCount[];
  purchaseTicketDetails: PurchaseTicketDetails[];
};
