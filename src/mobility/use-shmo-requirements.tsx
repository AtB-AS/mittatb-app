import {useGeolocationContext} from '@atb/GeolocationContext';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';
import {ShmoRequirementEnum, ShmoRequirementType} from './types';

export const useShmoRequirements = () => {
  const {locationIsAvailable} = useGeolocationContext();
  const {data: recurringPayments, isLoading: paymentsLoading} =
    useListRecurringPaymentsQuery();

  const blockers: ShmoRequirementType[] = [
    {
      requirement: ShmoRequirementEnum.LOCATION,
      isLoading: false,
      isBlocking: !locationIsAvailable,
    },
    {
      requirement: ShmoRequirementEnum.PAYMENT_CARD,
      isLoading: paymentsLoading,
      isBlocking: recurringPayments ? recurringPayments?.length === 0 : true,
    },
    {
      requirement: ShmoRequirementEnum.TERMS_AND_CONDITIONS,
      isLoading: false,
      isBlocking: true,
    },
  ];

  return {
    blockers,
  };
};
