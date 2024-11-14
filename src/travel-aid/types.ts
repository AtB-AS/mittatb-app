import type {RequireValue} from '@atb/utils/object';
import type {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';

export type ServiceJourneyWithGuaranteedCalls = RequireValue<
  ServiceJourneyWithEstCallsFragment,
  'estimatedCalls'
>;
