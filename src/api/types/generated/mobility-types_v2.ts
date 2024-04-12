export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends {[key: string]: unknown}, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | {[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: {input: string; output: string};
  String: {input: string; output: string};
  Boolean: {input: boolean; output: boolean};
  Int: {input: number; output: number};
  Float: {input: number; output: number};
};

export type BrandAssets = {
  brandImageUrl: Scalars['String']['output'];
  brandImageUrlDark?: Maybe<Scalars['String']['output']>;
  brandLastModified: Scalars['String']['output'];
  brandTermsUrl?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
};

export type EcoLabel = {
  countryCode: Scalars['String']['output'];
  ecoSticker: Scalars['String']['output'];
};

export type Feature = {
  geometry?: Maybe<MultiPolygon>;
  properties?: Maybe<GeofencingZoneProperties>;
  type?: Maybe<Scalars['String']['output']>;
};

export type FeatureCollection = {
  features?: Maybe<Array<Maybe<Feature>>>;
  type?: Maybe<Scalars['String']['output']>;
};

export enum FormFactor {
  Bicycle = 'BICYCLE',
  Car = 'CAR',
  CargoBicycle = 'CARGO_BICYCLE',
  Moped = 'MOPED',
  Other = 'OTHER',
  Scooter = 'SCOOTER',
  ScooterSeated = 'SCOOTER_SEATED',
  ScooterStanding = 'SCOOTER_STANDING',
}

export type GeofencingZoneProperties = {
  end?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** MultiPolygon where the lists of coordinates are encoded as polyline strings using precision of 6 decimals (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html). Meant to be used instead of geometry.coordinates to minimize the response payload size. */
  polylineEncodedMultiPolygon?: Maybe<
    Array<Maybe<Array<Maybe<Scalars['String']['output']>>>>
  >;
  rules?: Maybe<Array<Maybe<GeofencingZoneRule>>>;
  start?: Maybe<Scalars['Int']['output']>;
};

export type GeofencingZoneRule = {
  maximumSpeedKph?: Maybe<Scalars['Int']['output']>;
  rideAllowed: Scalars['Boolean']['output'];
  rideThroughAllowed: Scalars['Boolean']['output'];
  stationParking?: Maybe<Scalars['Boolean']['output']>;
  vehicleTypeIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type GeofencingZones = {
  geojson?: Maybe<FeatureCollection>;
  systemId?: Maybe<Scalars['ID']['output']>;
};

export type MultiPolygon = {
  /** See properties.polylineEncodedMultiPolygon, and consider using that instead of coordinates */
  coordinates?: Maybe<
    Array<
      Maybe<
        Array<Maybe<Array<Maybe<Array<Maybe<Scalars['Float']['output']>>>>>>
      >
    >
  >;
  type?: Maybe<Scalars['String']['output']>;
};

export type Operator = {
  id: Scalars['ID']['output'];
  name: TranslatedString;
};

export enum ParkingType {
  Other = 'OTHER',
  ParkingLot = 'PARKING_LOT',
  SidewalkParking = 'SIDEWALK_PARKING',
  StreetParking = 'STREET_PARKING',
  UndergroundParking = 'UNDERGROUND_PARKING',
}

export type PricingPlan = {
  currency: Scalars['String']['output'];
  description: TranslatedString;
  id: Scalars['ID']['output'];
  isTaxable: Scalars['Boolean']['output'];
  name: TranslatedString;
  perKmPricing?: Maybe<Array<Maybe<PricingSegment>>>;
  perMinPricing?: Maybe<Array<Maybe<PricingSegment>>>;
  price: Scalars['Float']['output'];
  surgePricing?: Maybe<Scalars['Boolean']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type PricingSegment = {
  end?: Maybe<Scalars['Int']['output']>;
  interval: Scalars['Int']['output'];
  rate: Scalars['Float']['output'];
  start: Scalars['Int']['output'];
};

export enum PropulsionType {
  Combustion = 'COMBUSTION',
  CombustionDiesel = 'COMBUSTION_DIESEL',
  Electric = 'ELECTRIC',
  ElectricAssist = 'ELECTRIC_ASSIST',
  Human = 'HUMAN',
  Hybrid = 'HYBRID',
  HydrogenFuelCell = 'HYDROGEN_FUEL_CELL',
  PlugInHybrid = 'PLUG_IN_HYBRID',
}

export type Query = {
  codespaces?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  geofencingZones?: Maybe<Array<Maybe<GeofencingZones>>>;
  operators?: Maybe<Array<Maybe<Operator>>>;
  station?: Maybe<Station>;
  stations?: Maybe<Array<Maybe<Station>>>;
  /** @deprecated stationsById is deprecated. Use stations query instead. */
  stationsById?: Maybe<Array<Maybe<Station>>>;
  vehicle?: Maybe<Vehicle>;
  vehicles?: Maybe<Array<Maybe<Vehicle>>>;
};

export type QueryGeofencingZonesArgs = {
  systemIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type QueryStationArgs = {
  id: Scalars['String']['input'];
};

export type QueryStationsArgs = {
  availableFormFactors?: InputMaybe<Array<InputMaybe<FormFactor>>>;
  availablePropulsionTypes?: InputMaybe<Array<InputMaybe<PropulsionType>>>;
  codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lon?: InputMaybe<Scalars['Float']['input']>;
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  range?: InputMaybe<Scalars['Int']['input']>;
  systems?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryStationsByIdArgs = {
  ids: Array<InputMaybe<Scalars['String']['input']>>;
};

export type QueryVehicleArgs = {
  id: Scalars['String']['input'];
};

export type QueryVehiclesArgs = {
  codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  formFactors?: InputMaybe<Array<InputMaybe<FormFactor>>>;
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  includeDisabled?: InputMaybe<Scalars['Boolean']['input']>;
  includeReserved?: InputMaybe<Scalars['Boolean']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lon?: InputMaybe<Scalars['Float']['input']>;
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  propulsionTypes?: InputMaybe<Array<InputMaybe<PropulsionType>>>;
  range?: InputMaybe<Scalars['Int']['input']>;
  systems?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Region = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type RentalApp = {
  discoveryUri?: Maybe<Scalars['String']['output']>;
  storeUri?: Maybe<Scalars['String']['output']>;
};

export type RentalApps = {
  android?: Maybe<RentalApp>;
  ios?: Maybe<RentalApp>;
};

export enum RentalMethod {
  Accountnumber = 'ACCOUNTNUMBER',
  Androidpay = 'ANDROIDPAY',
  Appleplay = 'APPLEPLAY',
  Creditcard = 'CREDITCARD',
  Key = 'KEY',
  Paypass = 'PAYPASS',
  Phone = 'PHONE',
  Transitcard = 'TRANSITCARD',
}

export type RentalUris = {
  android?: Maybe<Scalars['String']['output']>;
  ios?: Maybe<Scalars['String']['output']>;
  web?: Maybe<Scalars['String']['output']>;
};

export enum ReturnConstraint {
  AnyStation = 'ANY_STATION',
  FreeFloating = 'FREE_FLOATING',
  Hybrid = 'HYBRID',
  RoundtripStation = 'ROUNDTRIP_STATION',
}

export type Station = {
  address?: Maybe<Scalars['String']['output']>;
  capacity?: Maybe<Scalars['Int']['output']>;
  contactPhone?: Maybe<Scalars['String']['output']>;
  crossStreet?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isChargingStation?: Maybe<Scalars['Boolean']['output']>;
  isInstalled: Scalars['Boolean']['output'];
  isRenting: Scalars['Boolean']['output'];
  isReturning: Scalars['Boolean']['output'];
  isValetStation?: Maybe<Scalars['Boolean']['output']>;
  isVirtualStation?: Maybe<Scalars['Boolean']['output']>;
  lastReported: Scalars['Int']['output'];
  lat: Scalars['Float']['output'];
  lon: Scalars['Float']['output'];
  name: TranslatedString;
  numBikesAvailable: Scalars['Int']['output'];
  numBikesDisabled?: Maybe<Scalars['Int']['output']>;
  numDocksAvailable?: Maybe<Scalars['Int']['output']>;
  numDocksDisabled?: Maybe<Scalars['Int']['output']>;
  parkingHoop?: Maybe<Scalars['Boolean']['output']>;
  parkingType?: Maybe<ParkingType>;
  postCode?: Maybe<Scalars['String']['output']>;
  pricingPlans: Array<Maybe<PricingPlan>>;
  region?: Maybe<Region>;
  rentalMethods?: Maybe<Array<Maybe<RentalMethod>>>;
  rentalUris?: Maybe<RentalUris>;
  shortName?: Maybe<TranslatedString>;
  stationArea?: Maybe<MultiPolygon>;
  system: System;
  vehicleCapacity?: Maybe<Array<Maybe<VehicleTypeCapacity>>>;
  vehicleDocksAvailable?: Maybe<Array<Maybe<VehicleDocksAvailability>>>;
  vehicleTypeCapacity?: Maybe<Array<Maybe<VehicleTypeCapacity>>>;
  vehicleTypesAvailable?: Maybe<Array<Maybe<VehicleTypeAvailability>>>;
};

export type System = {
  brandAssets?: Maybe<BrandAssets>;
  email?: Maybe<Scalars['String']['output']>;
  feedContactEmail?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  licenseUrl?: Maybe<Scalars['String']['output']>;
  name: TranslatedString;
  operator: Operator;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  privacyLastUpdated?: Maybe<Scalars['String']['output']>;
  privacyUrl?: Maybe<Scalars['String']['output']>;
  purchaseUrl?: Maybe<Scalars['String']['output']>;
  rentalApps?: Maybe<RentalApps>;
  shortName?: Maybe<TranslatedString>;
  startDate?: Maybe<Scalars['String']['output']>;
  termsLastUpdated?: Maybe<Scalars['String']['output']>;
  termsUrl?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type TranslatedString = {
  translation: Array<Maybe<Translation>>;
};

export type Translation = {
  language: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Vehicle = {
  availableUntil?: Maybe<Scalars['String']['output']>;
  currentFuelPercent?: Maybe<Scalars['Float']['output']>;
  currentRangeMeters: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isDisabled: Scalars['Boolean']['output'];
  isReserved: Scalars['Boolean']['output'];
  lat: Scalars['Float']['output'];
  lon: Scalars['Float']['output'];
  pricingPlan: PricingPlan;
  rentalUris?: Maybe<RentalUris>;
  system: System;
  vehicleEquipment?: Maybe<Array<Maybe<VehicleEquipment>>>;
  vehicleType: VehicleType;
};

export enum VehicleAccessory {
  AirConditioning = 'AIR_CONDITIONING',
  Automatic = 'AUTOMATIC',
  Convertible = 'CONVERTIBLE',
  CruiseControl = 'CRUISE_CONTROL',
  Doors_2 = 'DOORS_2',
  Doors_3 = 'DOORS_3',
  Doors_4 = 'DOORS_4',
  Doors_5 = 'DOORS_5',
  Manual = 'MANUAL',
  Navigation = 'NAVIGATION',
}

export type VehicleAssets = {
  iconLastModified: Scalars['String']['output'];
  iconUrl: Scalars['String']['output'];
  iconUrlDark?: Maybe<Scalars['String']['output']>;
};

export type VehicleDocksAvailability = {
  count: Scalars['Int']['output'];
  vehicleTypes: Array<Maybe<VehicleType>>;
};

export enum VehicleEquipment {
  ChildSeatA = 'CHILD_SEAT_A',
  ChildSeatB = 'CHILD_SEAT_B',
  ChildSeatC = 'CHILD_SEAT_C',
  SnowChains = 'SNOW_CHAINS',
  WinterTires = 'WINTER_TIRES',
}

export type VehicleType = {
  cargoLoadCapacity?: Maybe<Scalars['Int']['output']>;
  cargoVolumeCapacity?: Maybe<Scalars['Int']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  defaultPricingPlan?: Maybe<PricingPlan>;
  defaultReserveTime?: Maybe<Scalars['Int']['output']>;
  ecoLabel?: Maybe<Array<Maybe<EcoLabel>>>;
  formFactor: FormFactor;
  gCO2km?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  make?: Maybe<Scalars['String']['output']>;
  maxPermittedSpeed?: Maybe<Scalars['Int']['output']>;
  maxRangeMeters?: Maybe<Scalars['Float']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name?: Maybe<TranslatedString>;
  pricingPlans?: Maybe<Array<Maybe<PricingPlan>>>;
  propulsionType: PropulsionType;
  ratedPower?: Maybe<Scalars['Int']['output']>;
  returnConstraint?: Maybe<ReturnConstraint>;
  riderCapacity?: Maybe<Scalars['Int']['output']>;
  vehicleAccessories?: Maybe<Array<Maybe<VehicleAccessory>>>;
  vehicleAssets?: Maybe<VehicleAssets>;
  vehicleImage?: Maybe<Scalars['String']['output']>;
  wheelCount?: Maybe<Scalars['Int']['output']>;
};

export type VehicleTypeAvailability = {
  count: Scalars['Int']['output'];
  vehicleType: VehicleType;
};

export type VehicleTypeCapacity = {
  count: Scalars['Int']['output'];
  vehicleType: VehicleType;
};
