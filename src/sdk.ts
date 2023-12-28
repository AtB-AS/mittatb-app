
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type RealtimeData = {
  serviceJourneyId: string;
  timeData: {
    realtime: boolean;
    expectedDepartureTime: string;
    aimedDepartureTime: string;
  };
};

export type DepartureRealtimeData = {
  quayId: string;
  departures: {[serviceJourneyId: string]: RealtimeData};
};

export type DeparturesRealtimeData = {
  [quayId: string]: DepartureRealtimeData;
};

export type CursoredData<T> = {
  data: T;
  metadata:
    | {hasNextPage: false}
    | {
        hasNextPage: true;
        nextCursor: string;
        nextUrlParams: string;
      };
};

export type CursorInput = {
  cursor?: string;
  pageSize?: number;
};

export type CursoredQuery<T> = CursorInput & T;

export enum LegMode {
  AIR = "air",
  BICYCLE = "bicycle",
  BUS = "bus",
  CABLEWAY = "cableway",
  CAR = "car",
  COACH = "coach",
  FOOT = "foot",
  FUNICULAR = "funicular",
  LIFT = "lift",
  METRO = "metro",
  RAIL = "rail",
  TRAM = "tram",
  WATER = "water"
}

export enum FeatureCategory {
  ONSTREET_BUS = "onstreetBus",
  ONSTREET_TRAM = "onstreetTram",
  AIRPORT = "airport",
  RAIL_STATION = "railStation",
  METRO_STATION = "metroStation",
  BUS_STATION = "busStation",
  COACH_STATION = "coachStation",
  TRAM_STATION = "tramStation",
  HARBOUR_PORT = "harbourPort",
  FERRY_PORT = "ferryPort",
  FERRY_STOP = "ferryStop",
  LIFT_STATION = "liftStation",
  VEHICLE_RAIL_INTERCHANGE = "vehicleRailInterchange",
  GROUP_OF_STOP_PLACES = "GroupOfStopPlaces",
  POI = "poi",
  VEGADRESSE = "Vegadresse",
  STREET = "street",
  TETTSTEDDEL = "tettsteddel",
  BYDEL = "bydel",
  OTHER = "other"
}

export declare type Feature = {
  geometry: {
      coordinates: [number, number];
      type: 'Point';
  };
  properties: {
      id: string;
      name: string;
      label?: string;
      borough: string;
      accuracy: 'point';
      layer: 'venue' | 'address';
      borough_gid: string;
      category: FeatureCategory[];
      country_gid: string;
      county: string;
      county_gid: string;
      gid: string;
      housenumber?: string;
      locality: string;
      locality_gid: string;
      postalcode: string;
      source: string;
      source_id: string;
      street: string;
      tariff_zones?: string[];
  };
};

export enum TransportSubmode {
  AIRPORT_LINK_BUS = "airportLinkBus",
  AIRPORT_LINK_RAIL = "airportLinkRail",
  CITY_TRAM = "cityTram",
  DOMESTIC_FLIGHT = "domesticFlight",
  EXPRESS_BUS = "expressBus",
  FUNICULAR = "funicular",
  HELICOPTER_SERVICE = "helicopterService",
  HIGH_SPEED_PASSENGER_SERVICE = "highSpeedPassengerService",
  HIGH_SPEED_VEHICLE_SERVICE = "highSpeedVehicleService",
  INTERNATIONAL = "international",
  INTERNATIONAL_CAR_FERRY = "internationalCarFerry",
  INTERNATIONAL_COACH = "internationalCoach",
  INTERNATIONAL_FLIGHT = "internationalFlight",
  INTERNATIONAL_PASSENGER_FERRY = "internationalPassengerFerry",
  INTERREGIONAL_RAIL = "interregionalRail",
  LOCAL = "local",
  LOCAL_BUS = "localBus",
  LOCAL_CAR_FERRY = "localCarFerry",
  LOCAL_PASSENGER_FERRY = "localPassengerFerry",
  LOCAL_TRAM = "localTram",
  LONG_DISTANCE = "longDistance",
  METRO = "metro",
  NATIONAL_CAR_FERRY = "nationalCarFerry",
  NATIONAL_COACH = "nationalCoach",
  NIGHT_BUS = "nightBus",
  NIGHT_RAIL = "nightRail",
  RAIL_REPLACEMENT_BUS = "railReplacementBus",
  REGIONAL_BUS = "regionalBus",
  REGIONAL_CAR_FERRY = "regionalCarFerry",
  REGIONAL_RAIL = "regionalRail",
  SCHOOL_BUS = "schoolBus",
  SHUTTLE_BUS = "shuttleBus",
  SIGHTSEEING_BUS = "sightseeingBus",
  SIGHTSEEING_SERVICE = "sightseeingService",
  TELECABIN = "telecabin",
  TOURIST_RAILWAY = "touristRailway"
}

export declare enum TransportSubmode {
  SchengenAreaFlight = "SchengenAreaFlight",
  AirportBoatLink = "airportBoatLink",
  AirportLinkBus = "airportLinkBus",
  AirportLinkRail = "airportLinkRail",
  AirshipService = "airshipService",
  AllFunicularServices = "allFunicularServices",
  AllHireVehicles = "allHireVehicles",
  AllTaxiServices = "allTaxiServices",
  BikeTaxi = "bikeTaxi",
  BlackCab = "blackCab",
  CableCar = "cableCar",
  CableFerry = "cableFerry",
  CanalBarge = "canalBarge",
  CarTransportRailService = "carTransportRailService",
  ChairLift = "chairLift",
  CharterTaxi = "charterTaxi",
  CityTram = "cityTram",
  CommunalTaxi = "communalTaxi",
  CommuterCoach = "commuterCoach",
  CrossCountryRail = "crossCountryRail",
  DedicatedLaneBus = "dedicatedLaneBus",
  DemandAndResponseBus = "demandAndResponseBus",
  DomesticCharterFlight = "domesticCharterFlight",
  DomesticFlight = "domesticFlight",
  DomesticScheduledFlight = "domesticScheduledFlight",
  DragLift = "dragLift",
  ExpressBus = "expressBus",
  Funicular = "funicular",
  HelicopterService = "helicopterService",
  HighFrequencyBus = "highFrequencyBus",
  HighSpeedPassengerService = "highSpeedPassengerService",
  HighSpeedRail = "highSpeedRail",
  HighSpeedVehicleService = "highSpeedVehicleService",
  HireCar = "hireCar",
  HireCycle = "hireCycle",
  HireMotorbike = "hireMotorbike",
  HireVan = "hireVan",
  IntercontinentalCharterFlight = "intercontinentalCharterFlight",
  IntercontinentalFlight = "intercontinentalFlight",
  International = "international",
  InternationalCarFerry = "internationalCarFerry",
  InternationalCharterFlight = "internationalCharterFlight",
  InternationalCoach = "internationalCoach",
  InternationalFlight = "internationalFlight",
  InternationalPassengerFerry = "internationalPassengerFerry",
  InterregionalRail = "interregionalRail",
  Lift = "lift",
  Local = "local",
  LocalBus = "localBus",
  LocalCarFerry = "localCarFerry",
  LocalPassengerFerry = "localPassengerFerry",
  LocalTram = "localTram",
  LongDistance = "longDistance",
  Metro = "metro",
  MiniCab = "miniCab",
  MobilityBus = "mobilityBus",
  MobilityBusForRegisteredDisabled = "mobilityBusForRegisteredDisabled",
  NationalCarFerry = "nationalCarFerry",
  NationalCoach = "nationalCoach",
  NationalPassengerFerry = "nationalPassengerFerry",
  NightBus = "nightBus",
  NightRail = "nightRail",
  PostBoat = "postBoat",
  PostBus = "postBus",
  RackAndPinionRailway = "rackAndPinionRailway",
  RailReplacementBus = "railReplacementBus",
  RailShuttle = "railShuttle",
  RailTaxi = "railTaxi",
  RegionalBus = "regionalBus",
  RegionalCarFerry = "regionalCarFerry",
  RegionalCoach = "regionalCoach",
  RegionalPassengerFerry = "regionalPassengerFerry",
  RegionalRail = "regionalRail",
  RegionalTram = "regionalTram",
  ReplacementRailService = "replacementRailService",
  RiverBus = "riverBus",
  RoadFerryLink = "roadFerryLink",
  RoundTripCharterFlight = "roundTripCharterFlight",
  ScheduledFerry = "scheduledFerry",
  SchoolAndPublicServiceBus = "schoolAndPublicServiceBus",
  SchoolBoat = "schoolBoat",
  SchoolBus = "schoolBus",
  SchoolCoach = "schoolCoach",
  ShortHaulInternationalFlight = "shortHaulInternationalFlight",
  ShuttleBus = "shuttleBus",
  ShuttleCoach = "shuttleCoach",
  ShuttleFerryService = "shuttleFerryService",
  ShuttleFlight = "shuttleFlight",
  ShuttleTram = "shuttleTram",
  SightseeingBus = "sightseeingBus",
  SightseeingCoach = "sightseeingCoach",
  SightseeingFlight = "sightseeingFlight",
  SightseeingService = "sightseeingService",
  SightseeingTram = "sightseeingTram",
  SleeperRailService = "sleeperRailService",
  SpecialCoach = "specialCoach",
  SpecialNeedsBus = "specialNeedsBus",
  SpecialTrain = "specialTrain",
  StreetCableCar = "streetCableCar",
  SuburbanRailway = "suburbanRailway",
  Telecabin = "telecabin",
  TelecabinLink = "telecabinLink",
  TouristCoach = "touristCoach",
  TouristRailway = "touristRailway",
  TrainFerry = "trainFerry",
  TrainTram = "trainTram",
  Tube = "tube",
  Undefined = "undefined",
  UndefinedFunicular = "undefinedFunicular",
  Unknown = "unknown",
  UrbanRailway = "urbanRailway",
  WaterTaxi = "waterTaxi"
}

export enum StreetMode {
  /** Bike only. This can be used as access/egress, but transfers will still be walk only. */
  Bicycle = "bicycle",
  /** Bike to a bike parking area, then walk the rest of the way. Direct mode and access mode only. */
  BikePark = "bike_park",
  /** Walk to a bike rental point, bike to a bike rental drop-off point, and walk the rest of the way. This can include bike rental at fixed locations or free-floating services. */
  BikeRental = "bike_rental",
  /** Car only. Direct mode only. */
  Car = "car",
  /** Start in the car, drive to a parking area, and walk the rest of the way. Direct mode and access mode only. */
  CarPark = "car_park",
  /** Walk to a pickup point along the road, drive to a drop-off point along the road, and walk the rest of the way. This can include various taxi-services or kiss & ride. */
  CarPickup = "car_pickup",
  /** Walk to an eligible pickup area for flexible transportation, ride to an eligible drop-off area and then walk the rest of the way. */
  Flexible = "flexible",
  /** Walk only */
  Foot = "foot",
  /** Walk to a scooter rental point, ride a scooter to a scooter rental drop-off point, and walk the rest of the way. This can include scooter rental at fixed locations or free-floating services. */
  ScooterRental = "scooter_rental"
}