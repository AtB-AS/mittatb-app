// TicketAssistant_SummaryScreenHooks.ts
import {useEffect} from 'react';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {getRecommendedTicket} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/api';
import {useFirestoreConfiguration} from '@atb/configuration';
import {handleRecommendedTicketResponse} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/handle-recommended-ticket-response';

export const useTicketAssistantDataFetch = (navigation: any) => {
  const {
    tariffZones,
    userProfiles,
    preassignedFareProducts,
    fareProductTypeConfigs,
  } = useFirestoreConfiguration();

  let {
    response,
    setResponse,
    data,
    setPurchaseDetails,
    hasDataChanged,
    setHasDataChanged,
  } = useTicketAssistantState();

  useEffect(() => {
    const fetchData = async () => {
      await getRecommendedTicket(data)
        .then((r) => {
          setHasDataChanged(false);
          if (r.length === 0) {
            return;
          }
          setResponse(r);
        })
        .catch(() => {});
    };

    const unsubscribe = navigation.addListener('focus', () => {
      if (hasDataChanged) {
        fetchData();
      }
    });
    try {
      if (response?.tickets !== undefined) {
        setPurchaseDetails(
          handleRecommendedTicketResponse(
            response,
            tariffZones,
            userProfiles,
            preassignedFareProducts,
            fareProductTypeConfigs,
          ),
        );
      }
    } catch (e) {}

    return () => {
      unsubscribe();
    };
  }, [
    data,
    hasDataChanged,
    response,
    setResponse,
    data,
    setPurchaseDetails,
    hasDataChanged,
    setHasDataChanged,
  ]);
};
