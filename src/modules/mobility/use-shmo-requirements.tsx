import {useGeolocationContext} from '@atb/modules/geolocation';
import {useListRecurringPaymentsQuery} from '@atb/modules/ticketing';
import {ShmoRequirementType} from './types';
import {
  AgeVerificationEnum,
  useGetAgeVerificationQuery,
} from './queries/use-get-age-verification-query';
import {useFeatureTogglesContext} from '../feature-toggles';
import {useAuthContext} from '@atb/modules/auth';
import {useMemo} from 'react';
import {useMapContext} from '../map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {PreReq, PreReqType} from '@atb/api/types/mobility';

export const useShmoRequirements = (
  preReqs?: PreReq[],
  formFactor?: FormFactor,
) => {
  const {authenticationType} = useAuthContext();
  const {givenScooterConsent, givenBicycleConsent} = useMapContext();
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
  const ageVerificationPreReq = preReqs?.find(
    (preReq) => preReq.type === PreReqType.AGE_VERIFICATION,
  );
  const operatorAgeLimit = ageVerificationPreReq?.minAge ?? 0;

  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  const {preciseLocationIsAvailable} = useGeolocationContext();
  const {data: recurringPayments, isLoading: paymentsLoading} =
    useListRecurringPaymentsQuery();

  const {data: ageVerification, isLoading: ageVerifiedLoading} =
    useGetAgeVerificationQuery(operatorAgeLimit, !!ageVerificationPreReq);

  const requirements: ShmoRequirementType[] = useMemo(() => {
    return (preReqs ?? []).map((preReq): ShmoRequirementType => {
      switch (preReq.type) {
        case PreReqType.IS_LOGGED_IN:
          return {
            requirementCode: PreReqType.IS_LOGGED_IN,
            isLoading: false,
            isBlocking: authenticationType !== 'phone',
          };
        case PreReqType.AGE_VERIFICATION:
          return {
            requirementCode: PreReqType.AGE_VERIFICATION,
            isLoading: ageVerifiedLoading && isShmoDeepIntegrationEnabled,
            isBlocking: ageVerification !== AgeVerificationEnum.LegalAge,
          };
        case PreReqType.TERMS_AND_CONDITIONS:
          return {
            requirementCode: PreReqType.TERMS_AND_CONDITIONS,
            isLoading: false,
            isBlocking: !givenConsent,
          };
        case PreReqType.PRECISE_LOCATION:
          return {
            requirementCode: PreReqType.PRECISE_LOCATION,
            isLoading: false,
            isBlocking: !preciseLocationIsAvailable,
          };
        case PreReqType.PAYMENT_METHOD:
          return {
            requirementCode: PreReqType.PAYMENT_METHOD,
            isLoading: paymentsLoading && isShmoDeepIntegrationEnabled,
            isBlocking: recurringPayments
              ? recurringPayments?.length === 0
              : true,
          };
        case PreReqType.UNSUPPORTED:
          return {
            requirementCode: PreReqType.UNSUPPORTED,
            isLoading: false,
            isBlocking: true,
          };
      }
    });
  }, [
    preReqs,
    authenticationType,
    ageVerifiedLoading,
    isShmoDeepIntegrationEnabled,
    ageVerification,
    givenConsent,
    preciseLocationIsAvailable,
    paymentsLoading,
    recurringPayments,
  ]);

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
