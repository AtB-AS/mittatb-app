import * as Types from './generated/journey_planner_v3_types';

export type ServiceJourneyPolylines = {
  mapLegs: ServiceJourneyPolyline[];
  start?: Types.Scalars['Coordinates']['output'];
  stop?: Types.Scalars['Coordinates']['output'];
};

type ServiceJourneyPolyline = {
  mode?: Types.Mode;
  faded: boolean;
  transportSubmode?: Types.TransportSubmode;
  pointsOnLink: Types.PointsOnLink;
};
