import {RequireValue} from '@atb/utils/object';
import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';

export type ServiceJourneyDepartureWithGuaranteedCalls = RequireValue<
    ServiceJourneyWithEstCallsFragment,
    'estimatedCalls'
>;
