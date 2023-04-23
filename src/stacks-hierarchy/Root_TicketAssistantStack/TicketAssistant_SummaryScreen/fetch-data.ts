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
      setLoading(true);
      setCrashed(false);
      await getRecommendedTicket(data)
        .then((r) => {
          setHasDataChanged(false);
          if (r.length === 0) {
            setCrashed(true);
            return;
          }
          setResponse(r);
        })
        .catch(() => {
          console.log('Error fetching recommended ticket');
          setCrashed(true);
        });
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
      console.log(e);
      setCrashed(true);
    }

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
