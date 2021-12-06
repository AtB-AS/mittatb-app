import {
  Mode,
  PointsOnLink as PointsOnLink_v2,
  PointsOnLink,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {LegMode} from '@entur/sdk';
import {Feature, LineString} from 'geojson';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type MapLeg = {
  mode?: LegMode;
  faded?: boolean;
  transportSubmode?: TransportSubmode;
  pointsOnLink: PointsOnLink | PointsOnLink_v2;
};

export interface MapLine extends Feature<LineString> {
  travelType?: Mode;
  subMode?: TransportSubmode;
  faded?: boolean;
}
