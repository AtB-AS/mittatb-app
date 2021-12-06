import {
  Mode,
  PointsOnLink as PointsOnLink_v2,
  PointsOnLink,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {LegMode} from '@entur/sdk';

export type MapLeg = {
  mode?: Mode;
  faded?: boolean;
  transportSubmode?: TransportSubmode;
  pointsOnLink?: PointsOnLink;
};

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type ServiceJourneyMapInfoData = {
  mapLegs: MapLeg[];
  start?: Coordinates;
  stop?: Coordinates;
};
