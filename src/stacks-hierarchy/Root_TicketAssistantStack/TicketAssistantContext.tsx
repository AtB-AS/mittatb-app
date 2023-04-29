import React, {createContext, useContext, useEffect, useState} from 'react';
import {useFirestoreConfiguration} from '@atb/configuration';
import {
  RecommendedTicketSummary,
  InputParams,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';
import {getRecommendedTicket} from '@atb/api/getRecommendedTicket';
import {handleRecommendedTicketResponse} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/handle-recommended-ticket-response';

type TicketAssistantState = {
  inputParams: InputParams;
  updateInputParams: (newData: InputParams) => void;
  recommendedTicketSummary?: RecommendedTicketSummary;
  loading: boolean;
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

  const [inputParams, setInputParams] = useState<InputParams>({
    frequency: undefined,
    traveller: undefined,
    duration: undefined,
    zones: undefined,
  });

  const [recommendedTicketSummary, setRecommendedTicketSummary] =
    useState<RecommendedTicketSummary>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const updateInputParams = (newData: InputParams) => {
    if (JSON.stringify(newData) !== JSON.stringify(inputParams)) {
      setInputParams((prevState) => ({...prevState, ...newData}));
    }
  };
  const {tariffZones, userProfiles} = useFirestoreConfiguration();

  useEffect(() => {
    const fetchData = () => {
      setError(false);
      setLoading(true);
      getRecommendedTicket(inputParams, preassignedFareProductsIds)
        .then((r) => {
          setRecommendedTicketSummary(
            handleRecommendedTicketResponse(
              r,
              tariffZones,
              userProfiles,
              preassignedFareProducts,
              fareProductTypeConfigs,
            ),
          );
          setLoading(false);
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
        recommendedTicketSummary,
        loading,
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
