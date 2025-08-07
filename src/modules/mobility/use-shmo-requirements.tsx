import {useGeolocationContext} from '@atb/modules/geolocation';
import {useListRecurringPaymentsQuery} from '@atb/modules/ticketing';
import {ShmoRequirementEnum, ShmoRequirementType} from './types';
import {usePersistedBoolState} from '@atb/utils/use-persisted-bool-state';
import {storage, StorageModelKeysEnum} from '@atb/modules/storage';
import {
  AgeVerificationEnum,
  useGetAgeVerificationQuery,
} from './queries/use-get-age-verification-query';
import {useFeatureTogglesContext} from '../feature-toggles';

export const useShmoRequirements = () => {
  const USER_AGE_LIMIT = 18; // Define the age limit for verification
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  const {preciseLocationIsAvailable} = useGeolocationContext();
  const {data: recurringPayments, isLoading: paymentsLoading} =
    useListRecurringPaymentsQuery();

  const [givenConsent, setGivenConsent] = usePersistedBoolState(
    storage,
    StorageModelKeysEnum.ScooterConsent,
    false,
  );

  const {data: ageVerification, isLoading: ageVerifiedLoading} =
    useGetAgeVerificationQuery(USER_AGE_LIMIT);

  const requirements: ShmoRequirementType[] = [
    {
      requirementCode: ShmoRequirementEnum.AGE_VERIFICATION,
      isLoading: ageVerifiedLoading && isShmoDeepIntegrationEnabled,
      isBlocking: ageVerification === AgeVerificationEnum.NotVerified,
    },
    {
      requirementCode: ShmoRequirementEnum.TERMS_AND_CONDITIONS,
      isLoading: false && isShmoDeepIntegrationEnabled,
      isBlocking: !givenConsent,
    },
    {
      requirementCode: ShmoRequirementEnum.LOCATION,
      isLoading: false && isShmoDeepIntegrationEnabled,
      isBlocking: !preciseLocationIsAvailable,
    },
    {
      requirementCode: ShmoRequirementEnum.PAYMENT_CARD,
      isLoading: paymentsLoading && isShmoDeepIntegrationEnabled,
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
    legalAge: USER_AGE_LIMIT,
    ageVerification,
  };
};
