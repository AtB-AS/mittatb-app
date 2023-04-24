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
    setCrashed,
  } = useTicketAssistantState();

  useEffect(() => {
    const fetchData = async () => {
      setCrashed(false);
      await getRecommendedTicket(data)
        .then((r) => {
          setHasDataChanged(false);
          if (r.tickets.length === 0) {
            setCrashed(true);
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
            setCrashed(true);
          }
        })
        .catch(() => {
          setCrashed(true);
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
