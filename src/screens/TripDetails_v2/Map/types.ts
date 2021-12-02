import {
  Mode,
  PointsOnLink,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

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
