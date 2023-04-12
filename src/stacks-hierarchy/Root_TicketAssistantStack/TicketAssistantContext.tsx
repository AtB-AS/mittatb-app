import {createContext, FunctionComponent, useState} from 'react';
import {
  FareProductTypeConfig,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';

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

export interface TicketAssistantData {
  frequency: number;
  duration: number;
  traveller: {id: string; user_type: string};
  zones: string[];
  products?: string[];
}

export interface TicketAssistantResponse {
  product_id: string;
  fare_product: string;
  duration: number;
  quantity: number;
  price: number;
  traveller: {id: string; user_type: string};
}

export interface Response {
  total_cost: number;
  tickets: TicketAssistantResponse[];
  zones: string[];
}

export interface PurchaseTicketDetails {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
}

export interface PurchaseDetails {
  tariffZones: TariffZoneWithMetadata[];
  userProfileWithCount: UserProfileWithCount[];
  purchaseTicketDetails: PurchaseTicketDetails[];
}

const TicketAssistantContext =
  createContext<TicketAssistantContextValue | null>(null);

export const TicketAssistantProvider: FunctionComponent = ({children}) => {
  const {preassignedFareProducts} = useFirestoreConfiguration();

  // List of preassigned fare products ids
  let preassignedFareProductsIds: string[] = [];
  for (let i = 0; i < preassignedFareProducts.length; i++) {
    if (
      preassignedFareProducts[i].type === 'period' ||
      preassignedFareProducts[i].type === 'single' ||
      preassignedFareProducts[i].type === 'hour24'
    ) {
      if (
        !(
          preassignedFareProducts[i].name.value?.includes('60') ||
          preassignedFareProducts[i].name.value?.includes('90')
        )
      ) {
        preassignedFareProductsIds.push(preassignedFareProducts[i].id);
      }
    }
  }

  const [data, setData] = useState<TicketAssistantData>({
    frequency: 7,
    traveller: {id: 'ADULT', user_type: 'ADULT'},
    duration: 7,
    zones: ['ATB:TariffZone:1'],
    products: preassignedFareProductsIds ? preassignedFareProductsIds : [''],
  });
  const [response, setResponse] = useState<Response>({
    total_cost: 0,
    zones: ['ATB:TariffZone:1', 'ATB:TariffZone:1'],
    tickets: [
      {
        product_id: '',
        fare_product: 'ATB:PreassignedFareProduct:8808c360',
        duration: 10,
        quantity: 2,
        price: 400,
        traveller: {id: 'ADULT', user_type: 'ADULT'},
      },
    ],
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
