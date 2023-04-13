import React, {createContext, useContext, useState} from 'react';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useOfferDefaults} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-offer-defaults';
import {
  PreassignedFareProductDetails,
  PurchaseDetails,
  TicketAssistantData,
  RecommendedTicketResponse,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

type TicketAssistantState = {
  data: TicketAssistantData;
  updateData: (newData: TicketAssistantData) => void;
  response: RecommendedTicketResponse;
  setResponse: (response: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (purchaseDetails: PurchaseDetails) => void;
  activeTicket: number;
  setActiveTicket: (activeTicket: number) => void;
};

const TicketAssistantContext = createContext<TicketAssistantState | undefined>(
  undefined,
);

const TicketAssistantContextProvider: React.FC = ({children}) => {
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
  const [response, setResponse] = useState<RecommendedTicketResponse>({
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

export function useTicketAssistantState() {
  const context = useContext(TicketAssistantContext);
  if (context === undefined) {
    throw new Error(
      'useTicketAssistantState must be used within a TicketAsssistantContextProvider',
    );
  }
  return context;
}

export default TicketAssistantContextProvider;
