import {
  Mode,
  PointsOnLink,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

import {Feature, LineString} from 'geojson';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type MapLeg = {
  mode?: Mode;
  faded?: boolean;
  transportSubmode?: TransportSubmode;
  pointsOnLink?: PointsOnLink;
};

export interface MapLine extends Feature<LineString> {
  travelType?: Mode;
  subMode?: TransportSubmode;
  faded?: boolean;
}
