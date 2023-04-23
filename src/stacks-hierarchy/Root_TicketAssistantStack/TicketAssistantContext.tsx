import React, {createContext, useContext, useState} from 'react';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useOfferDefaults} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-offer-defaults';
import {
  PurchaseDetails,
  TicketAssistantData,
  RecommendedTicketResponse,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

type TicketAssistantState = {
  data: TicketAssistantData;
  updateData: (newData: TicketAssistantData) => void;
  response: RecommendedTicketResponse;
  setResponse: (response: any) => void;
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: (purchaseDetails: PurchaseDetails) => void;
  hasDataChanged: boolean;
  setHasDataChanged: (hasDataChanged: boolean) => void;
};

const TicketAssistantContext = createContext<TicketAssistantState | undefined>(
  undefined,
);

const TicketAssistantContextProvider: React.FC = ({children}) => {
  const {preassignedFareProducts, fareProductTypeConfigs} =
    useFirestoreConfiguration();

  // List of preassigned fare products ids
  const preassignedFareProductsIds = preassignedFareProducts
    .filter(
      (product) =>
        product.type === 'single' || product.durationDays !== undefined,
    )
    .map((product) => ({
      id: product.id,
      duration_days: product.durationDays || 0,
    }));

  const offerDefaults = useOfferDefaults(
    undefined,
    fareProductTypeConfigs[0].type,
  );

  const {fromTariffZone, toTariffZone} = offerDefaults;

  const defaultTicketAssistantData: TicketAssistantData = {
    frequency: 7,
    traveller: {id: 'ADULT', user_type: 'ADULT'},
    duration: 7,
    zones: [fromTariffZone.id, toTariffZone.id],
    preassigned_fare_products: preassignedFareProductsIds || [],
  };

  const defaultRecommendedTicketResponse: RecommendedTicketResponse = {
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
  };

  const [data, setData] = useState<TicketAssistantData>(
    defaultTicketAssistantData,
  );
  const [response, setResponse] = useState<RecommendedTicketResponse>(
    defaultRecommendedTicketResponse,
  );

  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>(
    {} as PurchaseDetails,
  );
  const [hasDataChanged, setHasDataChanged] = useState<boolean>(false);
  const updateData = (newData: TicketAssistantData) => {
    setData((prevState) => ({...prevState, ...newData}));
    if (newData !== data) {
      setHasDataChanged(true);
    }
  };
  return (
    <TicketAssistantContext.Provider
      value={{
        data,
        updateData,
        response,
        setResponse,
        purchaseDetails,
        setPurchaseDetails,
        hasDataChanged,
        setHasDataChanged,
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

export {TicketAssistantContextProvider};
