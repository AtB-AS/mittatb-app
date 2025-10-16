import type {TariffZoneFragment} from '@atb/api/types/generated/fragments/tariffZone';
import type {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';

export type QuayFragment = {
  id: string;
  name: string;
  publicCode?: string;
  stopPlace?: StopPlaceFragment;
  tariffZones: Array<TariffZoneFragment>;
  description?: string;
};

export type QuayWithSituationsFragment = {
  situations: Array<SituationFragment>;
} & QuayFragment;
