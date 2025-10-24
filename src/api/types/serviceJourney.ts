import {AnyMode} from '@atb/components/icon-box';
import {Line} from '@atb/api/types/trips';
import {
  PointsOnLink,
  TransportSubmode,
  Scalars,
} from '@atb/api/types/generated/journey_planner_v3_types';

export type ServiceJourneyPolylines = {
  mapLegs: ServiceJourneyPolyline[];
  start?: Scalars['Coordinates']['output'];
  stop?: Scalars['Coordinates']['output'];
};

export type ServiceJourneyPolyline = {
  mode?: AnyMode;
  faded?: boolean;
  transportSubmode?: TransportSubmode;
  pointsOnLink?: PointsOnLink;
  line?: Line;
};
