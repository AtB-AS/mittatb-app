import type {RequiredField} from '@atb/utils/object';
import type {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';

export type ServiceJourneyWithGuaranteedCalls = RequiredField<
  ServiceJourneyWithEstCallsFragment,
  'estimatedCalls'
>;
