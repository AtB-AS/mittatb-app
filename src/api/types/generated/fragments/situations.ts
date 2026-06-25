import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {
  InfoLinkFragment,
  MultilingualStringFragment,
  ValidityPeriodFragment,
} from '@atb/api/types/generated/fragments/shared';

export type Affects_AffectedLine_Fragment = {__typename: 'AffectedLine'};

export type Affects_AffectedServiceJourney_Fragment = {
  __typename: 'AffectedServiceJourney';
};

export type Affects_AffectedStopPlace_Fragment = {
  __typename: 'AffectedStopPlace';
  stopPlace?: {name: string};
  quay?: {name: string};
};

export type Affects_AffectedStopPlaceOnLine_Fragment = {
  __typename: 'AffectedStopPlaceOnLine';
  stopPlace?: {name: string};
  quay?: {name: string};
};

export type Affects_AffectedStopPlaceOnServiceJourney_Fragment = {
  __typename: 'AffectedStopPlaceOnServiceJourney';
  stopPlace?: {name: string};
  quay?: {name: string};
};

export type Affects_AffectedUnknown_Fragment = {__typename: 'AffectedUnknown'};

export type AffectsFragment =
  | Affects_AffectedLine_Fragment
  | Affects_AffectedServiceJourney_Fragment
  | Affects_AffectedStopPlace_Fragment
  | Affects_AffectedStopPlaceOnLine_Fragment
  | Affects_AffectedStopPlaceOnServiceJourney_Fragment
  | Affects_AffectedUnknown_Fragment;

export type SituationFragment = {
  id: string;
  situationNumber?: string;
  reportType?: Types.ReportType;
  summary: Array<MultilingualStringFragment>;
  description: Array<MultilingualStringFragment>;
  advice: Array<MultilingualStringFragment>;
  infoLinks?: Array<InfoLinkFragment>;
  validityPeriod?: ValidityPeriodFragment;
  affects: Array<AffectsFragment>;
};
