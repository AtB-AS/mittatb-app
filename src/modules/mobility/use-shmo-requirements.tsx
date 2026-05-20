import {useGeolocationContext} from '@atb/modules/geolocation';
import {useListRecurringPaymentsQuery} from '@atb/modules/ticketing';
import {ShmoRequirementEnum, ShmoRequirementType} from './types';
import {
  AgeVerificationEnum,
  useGetAgeVerificationQuery,
} from './queries/use-get-age-verification-query';
import {useFeatureTogglesContext} from '../feature-toggles';
import {useOperators} from './use-operators';
import {useMemo} from 'react';
import {useMapContext} from '../map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const useShmoRequirements = (
  operatorId?: string,
  formFactor?: FormFactor,
) => {
  const {mobilityOperators} = useOperators();
  const {givenScooterConsent, givenBicycleConsent} = useMapContext();
  const operator = mobilityOperators?.find((op) => op.id === operatorId);
  const givenConsent = (() => {
    switch (formFactor) {
      case FormFactor.Bicycle:
        return givenBicycleConsent;
      case FormFactor.Scooter:
      case FormFactor.ScooterStanding:
        return givenScooterConsent;
      default:
        return false;
    }
  })();
  const operatorAgeLimit = operator?.ageLimit ?? 0;

  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  const {preciseLocationIsAvailable} = useGeolocationContext();
  const {data: recurringPayments, isLoading: paymentsLoading} =
    useListRecurringPaymentsQuery();

  const {data: ageVerification, isLoading: ageVerifiedLoading} =
    useGetAgeVerificationQuery(operatorAgeLimit);

  const requirements: ShmoRequirementType[] = useMemo(
    () => [
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
    ],
    [
      ageVerifiedLoading,
      isShmoDeepIntegrationEnabled,
      ageVerification,
      givenConsent,
      preciseLocationIsAvailable,
      paymentsLoading,
      recurringPayments,
    ],
  );

  const isLoading = requirements.some((req) => req.isLoading);
  const hasBlockers = requirements.some((req) => req.isBlocking);
  const numberOfBlockers = requirements.filter((req) => req.isBlocking).length;

  return {
    requirements,
    hasBlockers,
    numberOfBlockers,
    isLoading,
    operatorAgeLimit,
    ageVerification,
  };
};
