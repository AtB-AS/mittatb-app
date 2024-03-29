export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type BoundingBox = {
  maxLat: Scalars['Float'];
  maxLon: Scalars['Float'];
  minLat: Scalars['Float'];
  minLon: Scalars['Float'];
};

export type Codespace = {
  codespaceId: Scalars['String'];
};

export type Line = {
  lineName?: Maybe<Scalars['String']>;
  lineRef?: Maybe<Scalars['String']>;
  publicCode?: Maybe<Scalars['String']>;
};

export type Location = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export enum OccupancyEnumeration {
  FewSeatsAvailable = 'FEW_SEATS_AVAILABLE',
  Full = 'FULL',
  ManySeatsAvailable = 'MANY_SEATS_AVAILABLE',
  NotAcceptingPassengers = 'NOT_ACCEPTING_PASSENGERS',
  SeatsAvailable = 'SEATS_AVAILABLE',
  StandingAvailable = 'STANDING_AVAILABLE',
  Unknown = 'UNKNOWN',
}

export type Operator = {
  operatorRef: Scalars['String'];
};

export type PointsOnLink = {
  length?: Maybe<Scalars['Float']>;
  points?: Maybe<Scalars['String']>;
};

export type Query = {
  codespaces?: Maybe<Array<Maybe<Codespace>>>;
  lines?: Maybe<Array<Maybe<Line>>>;
  operators?: Maybe<Array<Maybe<Operator>>>;
  serviceJourney?: Maybe<ServiceJourney>;
  serviceJourneys?: Maybe<Array<Maybe<ServiceJourney>>>;
  vehicles?: Maybe<Array<Maybe<VehicleUpdate>>>;
};

export type QueryLinesArgs = {
  codespaceId?: InputMaybe<Scalars['String']>;
};

export type QueryOperatorsArgs = {
  codespaceId: Scalars['String'];
};

export type QueryServiceJourneyArgs = {
  id: Scalars['String'];
};

export type QueryServiceJourneysArgs = {
  lineRef: Scalars['String'];
};

export type QueryVehiclesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  codespaceId?: InputMaybe<Scalars['String']>;
  lineName?: InputMaybe<Scalars['String']>;
  lineRef?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']>;
  operatorRef?: InputMaybe<Scalars['String']>;
  serviceJourneyId?: InputMaybe<Scalars['String']>;
  vehicleId?: InputMaybe<Scalars['String']>;
};

export type ServiceJourney = {
  /** Date as provided when realtime-updates are referenced by ServiceJourneyId + Date */
  date?: Maybe<Scalars['String']>;
  /** ID that defines this journey */
  id: Scalars['String'];
  /** @deprecated Experimental - should not be used with subscription */
  pointsOnLink?: Maybe<PointsOnLink>;
  /** @deprecated Use 'id' instead. */
  serviceJourneyId: Scalars['String'];
};

export type Subscription = {
  /** @deprecated Use 'vehicles'. */
  vehicleUpdates?: Maybe<Array<Maybe<VehicleUpdate>>>;
  vehicles?: Maybe<Array<Maybe<VehicleUpdate>>>;
};

export type SubscriptionVehicleUpdatesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  bufferSize?: InputMaybe<Scalars['Int']>;
  bufferTime?: InputMaybe<Scalars['Int']>;
  codespaceId?: InputMaybe<Scalars['String']>;
  lineName?: InputMaybe<Scalars['String']>;
  lineRef?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']>;
  operatorRef?: InputMaybe<Scalars['String']>;
  serviceJourneyId?: InputMaybe<Scalars['String']>;
  vehicleId?: InputMaybe<Scalars['String']>;
};

export type SubscriptionVehiclesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  bufferSize?: InputMaybe<Scalars['Int']>;
  bufferTime?: InputMaybe<Scalars['Int']>;
  codespaceId?: InputMaybe<Scalars['String']>;
  lineName?: InputMaybe<Scalars['String']>;
  lineRef?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']>;
  operatorRef?: InputMaybe<Scalars['String']>;
  serviceJourneyId?: InputMaybe<Scalars['String']>;
  vehicleId?: InputMaybe<Scalars['String']>;
};

export enum VehicleModeEnumeration {
  Air = 'AIR',
  Bus = 'BUS',
  Coach = 'COACH',
  Ferry = 'FERRY',
  Metro = 'METRO',
  Rail = 'RAIL',
  Tram = 'TRAM',
}

export enum VehicleStatusEnumeration {
  Assigned = 'ASSIGNED',
  AtOrigin = 'AT_ORIGIN',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  OffRoute = 'OFF_ROUTE',
}

export type VehicleUpdate = {
  bearing?: Maybe<Scalars['Float']>;
  codespace?: Maybe<Codespace>;
  /** The current delay in seconds - negative delay means ahead of schedule */
  delay?: Maybe<Scalars['Float']>;
  destinationName?: Maybe<Scalars['String']>;
  destinationRef?: Maybe<Scalars['String']>;
  direction?: Maybe<Scalars['String']>;
  expiration?: Maybe<Scalars['DateTime']>;
  expirationEpochSecond?: Maybe<Scalars['Float']>;
  /** @deprecated Use 'bearing''. */
  heading?: Maybe<Scalars['Float']>;
  /** Whether the vehicle is affected by traffic jams or other circumstances which may lead to further delays. If `null`, current status is unknown. */
  inCongestion?: Maybe<Scalars['Boolean']>;
  lastUpdated?: Maybe<Scalars['DateTime']>;
  lastUpdatedEpochSecond?: Maybe<Scalars['Float']>;
  line?: Maybe<Line>;
  location?: Maybe<Location>;
  mode?: Maybe<VehicleModeEnumeration>;
  monitored?: Maybe<Scalars['Boolean']>;
  occupancy?: Maybe<OccupancyEnumeration>;
  operator?: Maybe<Operator>;
  originName?: Maybe<Scalars['String']>;
  originRef?: Maybe<Scalars['String']>;
  serviceJourney?: Maybe<ServiceJourney>;
  speed?: Maybe<Scalars['Float']>;
  vehicleId?: Maybe<Scalars['String']>;
  /** @deprecated Use 'vehicleId'. */
  vehicleRef?: Maybe<Scalars['String']>;
  /** Reported status of the vehicle */
  vehicleStatus?: Maybe<VehicleStatusEnumeration>;
};
