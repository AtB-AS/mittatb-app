import React, {createContext, useContext, useEffect, useState} from 'react';
import {useFirestoreConfiguration} from '@atb/configuration';
import {
  PurchaseDetails,
  TicketAssistantData,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';
import {getRecommendedTicket} from '@atb/api/getRecommendedTicket';
import {handleRecommendedTicketResponse} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/handle-recommended-ticket-response';

type TicketAssistantState = {
  inputParams: TicketAssistantData;
  updateInputParams: (newData: TicketAssistantData) => void;
  purchaseDetails?: PurchaseDetails;
  hasDataChanged: boolean;
  error: boolean;
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

  const [inputParams, setInputParams] = useState<TicketAssistantData>({
    frequency: undefined,
    traveller: undefined,
    duration: undefined,
    zones: undefined,
    preassigned_fare_products: preassignedFareProductsIds ?? [],
  });

  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>();
  const [hasDataChanged, setHasDataChanged] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const updateInputParams = (newData: TicketAssistantData) => {
    setInputParams((prevState) => ({...prevState, ...newData}));
    if (newData !== inputParams) {
      setHasDataChanged(true);
    }
  };
  const {tariffZones, userProfiles} = useFirestoreConfiguration();

  useEffect(() => {
    const fetchData = () => {
      getRecommendedTicket(inputParams)
        .then((r) => {
          setPurchaseDetails(
            handleRecommendedTicketResponse(
              r,
              tariffZones,
              userProfiles,
              preassignedFareProducts,
              fareProductTypeConfigs,
            ),
          );
          setHasDataChanged(false);
        })
        .catch(() => {
          setError(true);
        });
    };
    if (
      inputParams.traveller &&
      inputParams.frequency &&
      inputParams.duration &&
      inputParams.zones
    ) {
      fetchData();
    }
  }, [inputParams]);

  return (
    <TicketAssistantContext.Provider
      value={{
        inputParams,
        updateInputParams,
        purchaseDetails,
        hasDataChanged,
        error,
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
