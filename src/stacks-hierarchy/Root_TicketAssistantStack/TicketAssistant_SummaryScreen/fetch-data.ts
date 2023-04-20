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
    setLoading,
    setPurchaseDetails,
    hasDataChanged,
    setHasDataChanged,
  } = useTicketAssistantState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getRecommendedTicket(data)
        .then((r) => {
          setHasDataChanged(false);
          if (r.length === 0) {
            return;
          }
          setResponse(r);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
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
    } catch (e) {
      console.log('Error changing data ' + e);
    }

    return () => {
      unsubscribe();
    };
  }, [data, hasDataChanged]);
};
