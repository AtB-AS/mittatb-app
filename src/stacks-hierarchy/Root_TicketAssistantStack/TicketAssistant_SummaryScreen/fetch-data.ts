import {useEffect} from 'react';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {getRecommendedTicket} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/api';
import {handleRecommendedTicketResponse} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/handle-recommended-ticket-response';

export const useTicketAssistantDataFetch = (nav: any) => {
  const {
    tariffZones,
    userProfiles,
    preassignedFareProducts,
    fareProductTypeConfigs,
  } = useFirestoreConfiguration();
  const {
    response,
    setResponse,
    data,
    setPurchaseDetails,
    hasDataChanged,
    setHasDataChanged,
    setCrashed,
  } = useTicketAssistantState();

  const fetchData = async () => {
    try {
      setCrashed(false);
      const r = await getRecommendedTicket(data);
      setHasDataChanged(false);

      if (!r.tickets.length) {
        setCrashed(true);
      } else {
        setResponse(r);
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
  };

  useEffect(() => {
    const unsub = nav.addListener('focus', async () => {
      if (hasDataChanged) await fetchData();
    });
    return () => {
      unsub();
    };
  }, [
    data,
    hasDataChanged,
    response,
    setResponse,
    setPurchaseDetails,
    setHasDataChanged,
  ]);
};
