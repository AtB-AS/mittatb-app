import {Quay, StopPlace} from '@atb/api/types/departures';
import {GeoLocation, Location, SearchLocation} from '@atb/modules/favorites';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  LineString,
  Point,
  Position,
} from 'geojson';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {AnyMode} from '@atb/components/icon-box';
import {
  BikeStationFragment,
  CarStationFragment,
  StationBasicFragment,
} from '@atb/api/types/generated/fragments/stations';
import {
  VehicleBasicFragment,
  VehicleExtendedFragment,
} from '@atb/api/types/generated/fragments/vehicles';
import {z} from 'zod';

// prefixes added to distinguish between geojson types and generated mobility api types, as they are not exact matches
import {
  FormFactor as MobilityAPI_FormFactor,
  GeofencingZoneProperties as MobilityAPI_GeofencingZoneProperties,
  GeofencingZones as MobilityAPI_GeofencingZones,
  Feature as MobilityAPI_Feature,
  FeatureCollection as MobilityAPI_FeatureCollection,
} from '@atb/api/types/generated/mobility-types_v2';

import {TranslatedString} from '@atb/translations';
import {GeofencingZoneKeys, GeofencingZoneStyle} from '@atb-as/theme';
import {ContrastColor} from '@atb/theme/colors';

export type SelectionLocationCallback = (
  selectedLocation?: GeoLocation | SearchLocation,
) => void;

export type MapRegion = {
  // The coordinate bounds (ne, sw) visible in the user’s viewport.
  visibleBounds: Position[];
  zoomLevel: number;
  center: Position;
};

export type MapPadding =
  | number
  | [number, number]
  | [number, number, number, number];

export type VehicleFeatures = {
  bicycles: FeatureCollection<Point, VehicleBasicFragment>;
  scooters: FeatureCollection<Point, VehicleBasicFragment>;
};

export type VehiclesState = {
  vehicles: VehicleFeatures;
  updateRegion: (region: MapRegion) => void;
  isLoading: boolean;
  onFilterChange: (filter: MobilityMapFilterType) => void;
};

export type StationFeatures = {
  bicycles: FeatureCollection<Point, StationBasicFragment>;
  cars: FeatureCollection<Point, StationBasicFragment>;
};

export type StationsState = {
  stations: StationFeatures;
  updateRegion: (region: MapRegion) => void;
  isLoading: boolean;
  onFilterChange: (filter: MobilityMapFilterType) => void;
};

export type NavigateToTripSearchCallback = (
  location: GeoLocation | SearchLocation,
  destination: string,
) => void;

export type NavigateToQuayCallback = (place: StopPlace, quay: Quay) => void;
export type NavigateToDetailsCallback = (
  serviceJourneyId: string,
  serviceDate: string,
  date: string | undefined,
  fromStopPosition: number,
  isTripCancelled?: boolean,
) => void;

export type MapProps = {
  initialLocation?: Location;
  vehicles?: VehiclesState; // V1 only
  stations?: StationsState; // V1 only
  includeSnackbar?: boolean;
  navigateToQuay: NavigateToQuayCallback;
  navigateToDetails: NavigateToDetailsCallback;
  navigateToTripSearch: NavigateToTripSearchCallback;
};

export type Cluster = {
  cluster_id: number;
  cluster: boolean;
  point_count_abbreviated: string;
  point_count: number;
};

export interface MapLine extends Feature<LineString> {
  travelType?: AnyMode;
  subMode?: TransportSubmode;
  faded?: boolean;
}

const FormFactorFilter = z.object({
  showAll: z.boolean().default(false),
  operators: z.array(z.string()).default([]),
});
export type FormFactorFilterType = z.infer<typeof FormFactorFilter>;

const MobilityMapFilter = z.partialRecord(
  z.enum(Object.values(MobilityAPI_FormFactor)),
  FormFactorFilter,
);
export type MobilityMapFilterType = z.infer<typeof MobilityMapFilter>;

export const MapFilter = z.object({
  mobility: MobilityMapFilter,
});
export type MapFilterType = z.infer<typeof MapFilter>;

export type ParkingVehicleTypes = 'car' | 'pedalCycle';

export type ParkingType = {
  id: string;
  name: string;
  entityType: 'Parking';
  parkingVehicleTypes: ParkingVehicleTypes;
  totalCapacity: number;
};

export type PolylineEncodedMultiPolygon = String[][];

type GeofencingZoneProps<GZKey extends GeofencingZoneKeys> =
  GeofencingZoneStyle<ContrastColor> & {
    code: GZKey;
    isStationParking?: boolean;
  };

export type GeofencingZoneCustomProps = GeofencingZoneProps<GeofencingZoneKeys>;

// two things differ PreProcessed vs not:
// 1. geofencingZoneCustomProps on GeofencingZoneProperties
// 2. renderKey on GeofencingZones

export interface PreProcessedGeofencingZoneProperties
  extends MobilityAPI_GeofencingZoneProperties {
  geofencingZoneCustomProps?: GeofencingZoneCustomProps;
}

export interface PreProcessedFeature extends MobilityAPI_Feature {
  properties?: PreProcessedGeofencingZoneProperties;
}

export interface PreProcessedFeatureCollection
  extends MobilityAPI_FeatureCollection {
  features?: Array<PreProcessedFeature>;
}

export interface PreProcessedGeofencingZones
  extends MobilityAPI_GeofencingZones {
  renderKey?: string;
  geojson?: PreProcessedFeatureCollection;
}

type GeofencingZoneExplanationType = {
  title: TranslatedString;
  description: TranslatedString;
};

export type GeofencingZoneExplanationsType = {
  [GZKey in GeofencingZoneKeys | 'unspecified']: GeofencingZoneExplanationType;
};

export type SelectedMapItemProperties = GeoJsonProperties & {
  id?: string;
};
// export type SelectedFeature = Feature<Point, SelectedMapItemProperties>;
export type SelectedFeatureIdProp = {
  selectedFeatureId: SelectedMapItemProperties['id'];
};

export type AutoSelectableMapItem =
  | VehicleExtendedFragment
  | BikeStationFragment
  | CarStationFragment;

export type MapPropertiesType = {
  center: GeoJSON.Position;
  zoom: number;
};
