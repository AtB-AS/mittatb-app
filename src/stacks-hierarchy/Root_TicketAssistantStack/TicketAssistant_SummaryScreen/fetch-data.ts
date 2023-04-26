// TicketAssistant_SummaryScreenHooks.ts
import {useEffect} from 'react';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {useFirestoreConfiguration} from '@atb/configuration';
import {handleRecommendedTicketResponse} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/handle-recommended-ticket-response';
import {getRecommendedTicket} from '@atb/api/getRecommendedTicket';

export const useTicketAssistantDataFetch = (navigation: any) => {
  const {
    tariffZones,
    userProfiles,
    preassignedFareProducts,
    fareProductTypeConfigs,
  } = useFirestoreConfiguration();

  const {
    setResponse,
    data,
    setPurchaseDetails,
    hasDataChanged,
    setHasDataChanged,
    setError,
  } = useTicketAssistantState();

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      await getRecommendedTicket(data)
        .then((r) => {
          setHasDataChanged(false);
          if (r.tickets.length === 0) {
            setError(true);
            return;
          }
          setResponse(r);
          try {
            if (r.tickets !== undefined) {
              setPurchaseDetails(
                handleRecommendedTicketResponse(
                  r,
                  tariffZones,
                  userProfiles,
                  preassignedFareProducts,
                  fareProductTypeConfigs,
                ),
              );
            }
          } catch (e) {
            setError(true);
          }
        })
        .catch(() => {
          setError(true);
        });
    };

    const unsubscribe = navigation.addListener('focus', () => {
      if (hasDataChanged) {
        fetchData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [data]);
};
