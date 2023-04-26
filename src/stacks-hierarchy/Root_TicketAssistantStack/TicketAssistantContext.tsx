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
  response?: RecommendedTicketResponse;
  setResponse: (response: RecommendedTicketResponse) => void;
  purchaseDetails?: PurchaseDetails;
  setPurchaseDetails: (purchaseDetails: PurchaseDetails) => void;
  hasDataChanged: boolean;
  setHasDataChanged: (hasDataChanged: boolean) => void;
  error: boolean;
  setError: (crashed: boolean) => void;
};

const TicketAssistantContext = createContext<TicketAssistantState | undefined>(
  undefined,
);

const TicketAssistantContextProvider: React.FC = ({children}) => {
  const {preassignedFareProducts, fareProductTypeConfigs} =
    useFirestoreConfiguration();

  const preassignedFareProductsIds = preassignedFareProducts
    .filter(
      (product) =>
        product.type === 'single' ||
        product.type === 'period' ||
        product.type === 'hour24',
    )
    .map((product) => product.id);

  const offerDefaults = useOfferDefaults(
    undefined,
    fareProductTypeConfigs[0].type,
  );

  const {fromTariffZone, toTariffZone} = offerDefaults;

  const [data, setData] = useState<TicketAssistantData>({
    frequency: 7,
    traveller: {id: 'ADULT', user_type: 'ADULT'},
    duration: 7,
    zones: [fromTariffZone.id, toTariffZone.id],
    preassigned_fare_products: preassignedFareProductsIds || [],
  });
  const [response, setResponse] = useState<RecommendedTicketResponse>();

  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>();
  const [hasDataChanged, setHasDataChanged] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
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
        error,
        setError,
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
