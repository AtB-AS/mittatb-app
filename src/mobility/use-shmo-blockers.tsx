import {ShmoBlockers, ShmoBlockersEnum} from '@atb/api/types/mobility';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';

export const useShmoBlockers = () => {
  const {locationIsAvailable} = useGeolocationContext();
  const {data: recurringPayments, isLoading: paymentsLoading} =
    useListRecurringPaymentsQuery();

  const blockers: ShmoBlockers[] = [
    {
      blocker: ShmoBlockersEnum.LOCATION,
      loading: false,
      isBlocking: !locationIsAvailable,
    },
    {
      blocker: ShmoBlockersEnum.PAYMENT_CARD,
      loading: paymentsLoading,
      isBlocking: recurringPayments ? recurringPayments?.length === 0 : true,
    },
    {
      blocker: ShmoBlockersEnum.TERMS_AND_CONDITIONS,
      loading: false,
      isBlocking: true,
    },
  ];

  return {
    blockers,
  };
};
