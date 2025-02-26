import {useGeolocationContext} from '@atb/GeolocationContext';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';
import {ShmoRequirementEnum, ShmoRequirementType} from './types';

export const useShmoRequirements = () => {
  const {locationIsAvailable} = useGeolocationContext();
  const {data: recurringPayments, isLoading: paymentsLoading} =
    useListRecurringPaymentsQuery();

  const requirements: ShmoRequirementType[] = [
    {
      requirementCode: ShmoRequirementEnum.TERMS_AND_CONDITIONS,
      isLoading: false,
      isBlocking: false,
    },
    {
      requirementCode: ShmoRequirementEnum.LOCATION,
      isLoading: false,
      isBlocking: !locationIsAvailable,
    },
    {
      requirementCode: ShmoRequirementEnum.PAYMENT_CARD,
      isLoading: paymentsLoading,
      isBlocking: recurringPayments ? recurringPayments?.length === 0 : true,
    },
  ];

  const hasBlockers = requirements.some((req) => req.isBlocking);
  const numberOfBlockers = requirements.filter((req) => req.isBlocking).length;

  return {
    requirements,
    hasBlockers,
    numberOfBlockers,
  };
};
