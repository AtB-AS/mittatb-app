import {useGeolocationContext} from '@atb/GeolocationContext';
import {useListRecurringPaymentsQuery} from '@atb/modules/ticketing';
import {ShmoRequirementEnum, ShmoRequirementType} from './types';
import {usePersistedBoolState} from '@atb/utils/use-persisted-bool-state';
import {storage} from '@atb/modules/storage';

export const useShmoRequirements = () => {
  const {locationIsAvailable} = useGeolocationContext();
  const {data: recurringPayments, isLoading: paymentsLoading} =
    useListRecurringPaymentsQuery();

  const [givenConsent, setGivenConsent] = usePersistedBoolState(
    storage,
    '@ATB_scooter_consent',
    false,
  );

  const requirements: ShmoRequirementType[] = [
    {
      requirementCode: ShmoRequirementEnum.TERMS_AND_CONDITIONS,
      isLoading: false,
      isBlocking: !givenConsent,
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

  const isLoading = requirements.some((req) => req.isLoading);
  const hasBlockers = requirements.some((req) => req.isBlocking);
  const numberOfBlockers = requirements.filter((req) => req.isBlocking).length;

  return {
    requirements,
    hasBlockers,
    numberOfBlockers,
    setGivenConsent,
    isLoading,
  };
};
