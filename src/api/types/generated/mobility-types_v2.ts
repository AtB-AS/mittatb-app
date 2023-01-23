export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type BrandAssets = {
  brandImageUrl: Scalars['String'];
  brandImageUrlDark?: Maybe<Scalars['String']>;
  brandLastModified: Scalars['String'];
  brandTermsUrl?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};

export type EcoLabel = {
  countryCode: Scalars['String'];
  ecoSticker: Scalars['String'];
};

export type Feature = {
  geometry?: Maybe<MultiPolygon>;
  properties?: Maybe<GeofencingZoneProperties>;
  type?: Maybe<Scalars['String']>;
};

export type FeatureCollection = {
  features?: Maybe<Array<Maybe<Feature>>>;
  type?: Maybe<Scalars['String']>;
};

export enum FormFactor {
  Bicycle = 'BICYCLE',
  Car = 'CAR',
  CargoBicycle = 'CARGO_BICYCLE',
  Moped = 'MOPED',
  Other = 'OTHER',
  Scooter = 'SCOOTER',
  ScooterSeated = 'SCOOTER_SEATED',
  ScooterStanding = 'SCOOTER_STANDING'
}

export type GeofencingZoneProperties = {
  end?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  rules?: Maybe<Array<Maybe<GeofencingZoneRule>>>;
  start?: Maybe<Scalars['Int']>;
};

export type GeofencingZoneRule = {
  maximumSpeedKph?: Maybe<Scalars['Int']>;
  rideAllowed: Scalars['Boolean'];
  rideThroughAllowed: Scalars['Boolean'];
  stationParking?: Maybe<Scalars['Boolean']>;
  vehicleTypeIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type GeofencingZones = {
  geojson?: Maybe<FeatureCollection>;
  systemId?: Maybe<Scalars['ID']>;
};

export type MultiPolygon = {
  coordinates?: Maybe<Array<Maybe<Array<Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>>>>>;
  type?: Maybe<Scalars['String']>;
};

export type Operator = {
  id: Scalars['ID'];
  name: TranslatedString;
};

export enum ParkingType {
  Other = 'OTHER',
  ParkingLot = 'PARKING_LOT',
  SidewalkParking = 'SIDEWALK_PARKING',
  StreetParking = 'STREET_PARKING',
  UndergroundParking = 'UNDERGROUND_PARKING'
}

export type PricingPlan = {
  currency: Scalars['String'];
  description: TranslatedString;
  id: Scalars['ID'];
  isTaxable: Scalars['Boolean'];
  name: TranslatedString;
  perKmPricing?: Maybe<Array<Maybe<PricingSegment>>>;
  perMinPricing?: Maybe<Array<Maybe<PricingSegment>>>;
  price: Scalars['Float'];
  surgePricing?: Maybe<Scalars['Boolean']>;
  url?: Maybe<Scalars['String']>;
};

export type PricingSegment = {
  end?: Maybe<Scalars['Int']>;
  interval: Scalars['Int'];
  rate: Scalars['Float'];
  start: Scalars['Int'];
};

export enum PropulsionType {
  Combustion = 'COMBUSTION',
  CombustionDiesel = 'COMBUSTION_DIESEL',
  Electric = 'ELECTRIC',
  ElectricAssist = 'ELECTRIC_ASSIST',
  Human = 'HUMAN',
  Hybrid = 'HYBRID',
  HydrogenFuelCell = 'HYDROGEN_FUEL_CELL',
  PlugInHybrid = 'PLUG_IN_HYBRID'
}

export type Query = {
  codespaces?: Maybe<Array<Maybe<Scalars['String']>>>;
  geofencingZones?: Maybe<Array<Maybe<GeofencingZones>>>;
  operators?: Maybe<Array<Maybe<Operator>>>;
  stations?: Maybe<Array<Maybe<Station>>>;
  stationsById?: Maybe<Array<Maybe<Station>>>;
  vehicles?: Maybe<Array<Maybe<Vehicle>>>;
};


export type QueryGeofencingZonesArgs = {
  systemIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type QueryStationsArgs = {
  availableFormFactors?: InputMaybe<Array<InputMaybe<FormFactor>>>;
  availablePropulsionTypes?: InputMaybe<Array<InputMaybe<PropulsionType>>>;
  codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  count?: InputMaybe<Scalars['Int']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  range: Scalars['Int'];
  systems?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryStationsByIdArgs = {
  ids: Array<InputMaybe<Scalars['String']>>;
};


export type QueryVehiclesArgs = {
  codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  count?: InputMaybe<Scalars['Int']>;
  formFactors?: InputMaybe<Array<InputMaybe<FormFactor>>>;
  includeDisabled?: InputMaybe<Scalars['Boolean']>;
  includeReserved?: InputMaybe<Scalars['Boolean']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  propulsionTypes?: InputMaybe<Array<InputMaybe<PropulsionType>>>;
  range: Scalars['Int'];
  systems?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Region = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type RentalApp = {
  discoveryUri?: Maybe<Scalars['String']>;
  storeUri?: Maybe<Scalars['String']>;
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
  Transitcard = 'TRANSITCARD'
}

export type RentalUris = {
  android?: Maybe<Scalars['String']>;
  ios?: Maybe<Scalars['String']>;
  web?: Maybe<Scalars['String']>;
};

export enum ReturnConstraint {
  AnyStation = 'ANY_STATION',
  FreeFloating = 'FREE_FLOATING',
  Hybrid = 'HYBRID',
  RoundtripStation = 'ROUNDTRIP_STATION'
}

export type Station = {
  address?: Maybe<Scalars['String']>;
  capacity?: Maybe<Scalars['Int']>;
  contactPhone?: Maybe<Scalars['String']>;
  crossStreet?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isChargingStation?: Maybe<Scalars['Boolean']>;
  isInstalled: Scalars['Boolean'];
  isRenting: Scalars['Boolean'];
  isReturning: Scalars['Boolean'];
  isValetStation?: Maybe<Scalars['Boolean']>;
  isVirtualStation?: Maybe<Scalars['Boolean']>;
  lastReported: Scalars['Int'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  name: TranslatedString;
  numBikesAvailable: Scalars['Int'];
  numBikesDisabled?: Maybe<Scalars['Int']>;
  numDocksAvailable?: Maybe<Scalars['Int']>;
  numDocksDisabled?: Maybe<Scalars['Int']>;
  parkingHoop?: Maybe<Scalars['Boolean']>;
  parkingType?: Maybe<ParkingType>;
  postCode?: Maybe<Scalars['String']>;
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
  email?: Maybe<Scalars['String']>;
  feedContactEmail?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  language: Scalars['String'];
  licenseUrl?: Maybe<Scalars['String']>;
  name: TranslatedString;
  operator: Operator;
  phoneNumber?: Maybe<Scalars['String']>;
  privacyLastUpdated?: Maybe<Scalars['String']>;
  privacyUrl?: Maybe<Scalars['String']>;
  purchaseUrl?: Maybe<Scalars['String']>;
  rentalApps?: Maybe<RentalApps>;
  shortName?: Maybe<TranslatedString>;
  startDate?: Maybe<Scalars['String']>;
  termsLastUpdated?: Maybe<Scalars['String']>;
  termsUrl?: Maybe<Scalars['String']>;
  timezone: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type TranslatedString = {
  translation: Array<Maybe<Translation>>;
};

export type Translation = {
  language: Scalars['String'];
  value: Scalars['String'];
};

export type Vehicle = {
  availableUntil?: Maybe<Scalars['String']>;
  currentFuelPercent?: Maybe<Scalars['Float']>;
  currentRangeMeters: Scalars['Float'];
  id: Scalars['ID'];
  isDisabled: Scalars['Boolean'];
  isReserved: Scalars['Boolean'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
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
  Navigation = 'NAVIGATION'
}

export type VehicleAssets = {
  iconLastModified: Scalars['String'];
  iconUrl: Scalars['String'];
  iconUrlDark?: Maybe<Scalars['String']>;
};

export type VehicleDocksAvailability = {
  count: Scalars['Int'];
  vehicleTypes: Array<Maybe<VehicleType>>;
};

export enum VehicleEquipment {
  ChildSeatA = 'CHILD_SEAT_A',
  ChildSeatB = 'CHILD_SEAT_B',
  ChildSeatC = 'CHILD_SEAT_C',
  SnowChains = 'SNOW_CHAINS',
  WinterTires = 'WINTER_TIRES'
}

export type VehicleType = {
  cargoLoadCapacity?: Maybe<Scalars['Int']>;
  cargoVolumeCapacity?: Maybe<Scalars['Int']>;
  color?: Maybe<Scalars['String']>;
  defaultPricingPlan?: Maybe<PricingPlan>;
  defaultReserveTime?: Maybe<Scalars['Int']>;
  ecoLabel?: Maybe<Array<Maybe<EcoLabel>>>;
  formFactor: FormFactor;
  gCO2km?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  make?: Maybe<Scalars['String']>;
  maxPermittedSpeed?: Maybe<Scalars['Int']>;
  maxRangeMeters?: Maybe<Scalars['Float']>;
  model?: Maybe<Scalars['String']>;
  name?: Maybe<TranslatedString>;
  pricingPlans?: Maybe<Array<Maybe<PricingPlan>>>;
  propulsionType: PropulsionType;
  ratedPower?: Maybe<Scalars['Int']>;
  returnConstraint?: Maybe<ReturnConstraint>;
  riderCapacity?: Maybe<Scalars['Int']>;
  vehicleAccessories?: Maybe<Array<Maybe<VehicleAccessory>>>;
  vehicleAssets?: Maybe<VehicleAssets>;
  vehicleImage?: Maybe<Scalars['String']>;
  wheelCount?: Maybe<Scalars['Int']>;
};

export type VehicleTypeAvailability = {
  count: Scalars['Int'];
  vehicleType: VehicleType;
};

export type VehicleTypeCapacity = {
  count: Scalars['Int'];
  vehicleType: VehicleType;
};
