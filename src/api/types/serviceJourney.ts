import * as Types_v3 from './generated/journey_planner_v3_types';

export type ServiceJourneyMapInfoData_v3 = {
  mapLegs: MapLeg_v3[];
  start?: Types_v3.Scalars['Coordinates']['output'];
  stop?: Types_v3.Scalars['Coordinates']['output'];
};

export type MapLeg_v3 = {
  mode?: Types_v3.Mode;
  faded: boolean;
  transportSubmode?: Types_v3.TransportSubmode;
  pointsOnLink: Types_v3.PointsOnLink;
};
