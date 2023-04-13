import {createContext, FunctionComponent, useState} from 'react';
import {
  FareProductTypeConfig,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';
import {useOfferDefaults} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-offer-defaults';

export interface TicketAssistantContextValue {
  data: TicketAssistantData;
  updateData: (newData: TicketAssistantData) => void;
  response: Response;
  setResponse: (response: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (purchaseDetails: PurchaseDetails) => void;
  activeTicket: number;
  setActiveTicket: (activeTicket: number) => void;
}

export type Traveller = {
  id: string;
  user_type: string;
};
export type TicketAssistantData = {
  frequency: number;
  duration: number;
  traveller: Traveller;
  zones: string[];
  preassigned_fare_products: PreassignedFareProductDetails[];
};

export type PreassignedFareProductDetails = {
  id: string;
  duration_days: number;
};

export type TicketResponseData = {
  product_id: string;
  fare_product: string;
  duration: number;
  quantity: number;
  price: number;
  traveller: {id: string; user_type: string};
};

export type Response = {
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

const TicketAssistantContext =
  createContext<TicketAssistantContextValue | null>(null);

export const TicketAssistantProvider: FunctionComponent = ({children}) => {
  const {preassignedFareProducts, fareProductTypeConfigs} =
    useFirestoreConfiguration();

  // List of preassigned fare products ids
  let preassignedFareProductsIds: PreassignedFareProductDetails[] = [];
  for (let i = 0; i < preassignedFareProducts.length; i++) {
    if (
      preassignedFareProducts[i].type === 'single' ||
      preassignedFareProducts[i].durationDays
    ) {
      preassignedFareProductsIds.push({
        id: preassignedFareProducts[i].id,
        duration_days: preassignedFareProducts[i].durationDays || 0,
      });
    }
  }
  const offerDefaults = useOfferDefaults(
    undefined,
    fareProductTypeConfigs[0].type,
  );

  let {fromTariffZone, toTariffZone} = offerDefaults;

  const [data, setData] = useState<TicketAssistantData>({
    frequency: 7,
    traveller: {id: 'ADULT', user_type: 'ADULT'},
    duration: 7,
    zones: [fromTariffZone.id, toTariffZone.id],
    preassigned_fare_products: preassignedFareProductsIds
      ? preassignedFareProductsIds
      : [],
  });
  const [response, setResponse] = useState<Response>({
    total_cost: 301,
    zones: [fromTariffZone.id, toTariffZone.id],
    tickets: [
      {
        product_id: 'ATB:SalesPackage:ded0dc3b',
        fare_product: 'ATB:PreassignedFareProduct:8808c360',
        duration: 7,
        quantity: 1,
        price: 301,
        traveller: {id: 'ADULT', user_type: 'ADULT'},
      },
    ],
    single_ticket_price: 43,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>(
    {} as PurchaseDetails,
  );
  const [activeTicket, setActiveTicket] = useState<number>(0);
  const updateData = (newData: TicketAssistantData) => {
    setData((prevState) => ({...prevState, ...newData}));
  };
  return (
    <TicketAssistantContext.Provider
      value={{
        data,
        updateData,
        response,
        setResponse,
        loading,
        setLoading,
        purchaseDetails,
        setPurchaseDetails,
        activeTicket,
        setActiveTicket,
      }}
    >
      {children}
    </TicketAssistantContext.Provider>
  );
};

export default TicketAssistantContext;
