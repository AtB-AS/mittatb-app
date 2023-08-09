import {Quay, StopPlace} from '@atb/api/types/departures';
import {GeoLocation, Location, SearchLocation} from '@atb/favorites';
import {
  Feature,
  FeatureCollection,
  GeoJSON,
  LineString,
  Point,
  Position,
} from 'geojson';
import {Coordinates} from '@atb/utils/coordinates';
import {
  PointsOnLink,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {AnyMode} from '@atb/components/icon-box';
import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';

/**
 * MapSelectionMode: Parameter to decide how on-select/ on-click on the map
 * should behave
 *  - ExploreEntities: If only the map entities (Bus, Trams stops etc.) should be
 *    interactable, and will open a bottom sheet with details for the entity.
 *  - ExploreLocation: If every selected location should be interactable. It
 *    also shows the Location bar on top of the Map to show the currently
 *    selected location
 */
export type MapSelectionMode = 'ExploreEntities' | 'ExploreLocation';

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

export type VehiclesState = {
  vehicles: FeatureCollection<GeoJSON.Point, VehicleBasicFragment>;
  updateRegion: (region: MapRegion) => void;
  isLoading: boolean;
  onFilterChange: (filter: VehiclesFilterType) => void;
};

export type StationsState = {
  stations: FeatureCollection<GeoJSON.Point, StationBasicFragment>;
  updateRegion: (region: MapRegion) => void;
  isLoading: boolean;
  onFilterChange: (filter: StationsFilterType) => void;
};

export type NavigateToTripSearchCallback = (
  location: GeoLocation | SearchLocation,
  destination: string,
) => void;
export type NavigateToQuayCallback = (place: StopPlace, quay: Quay) => void;
export type NavigateToDetailsCallback = (
  serviceJourneyId: string,
  serviceDate: string,
  date?: string,
  fromQuayId?: string,
  isTripCancelled?: boolean,
) => void;

export type MapProps = {
  initialLocation?: Location;
  vehicles?: VehiclesState;
  stations?: StationsState;
} & (
  | {
      selectionMode: 'ExploreLocation';
      onLocationSelect: SelectionLocationCallback;
    }
  | {
      selectionMode: 'ExploreEntities';
      navigateToQuay: NavigateToQuayCallback;
      navigateToDetails: NavigateToDetailsCallback;
      navigateToTripSearch: NavigateToTripSearchCallback;
    }
);

export type Cluster = {
  cluster_id: number;
  cluster: boolean;
  point_count_abbreviated: string;
  point_count: number;
};

export type MapSelectionActionType =
  | {
      source: 'map-click';
      feature: Feature<Point>;
    }
  | {
      source: 'cluster-click';
      feature: Feature<Point, Cluster>;
    }
  | {
      source: 'my-position';
      coords: Coordinates;
    };

export type CameraFocusModeType =
  | {
      mode: 'map-lines';
      mapLines: MapLine[];
      distance: number;
    }
  | {
      mode: 'entity';
      entityFeature: Feature<Point>;
      mapLines?: MapLine[];
      distance?: number;
      zoomTo?: boolean;
    }
  | {
      mode: 'coordinates';
      coordinates: Coordinates;
    }
  | {
      mode: 'my-position';
      coordinates: Coordinates;
    };

export type MapLeg = {
  mode?: AnyMode;
  faded?: boolean;
  transportSubmode?: TransportSubmode;
  pointsOnLink?: PointsOnLink;
};

export interface MapLine extends Feature<LineString> {
  travelType?: AnyMode;
  subMode?: TransportSubmode;
  faded?: boolean;
}

export type OperatorFilterType = {
  showAll: boolean;
  operators: string[];
};

export type VehiclesFilterType = {
  scooters?: OperatorFilterType;
  bicycles?: OperatorFilterType;
};

export type StationsFilterType = {
  cityBikeStations?: OperatorFilterType;
  carSharingStations?: OperatorFilterType;
};

export type MapFilterType = {
  vehicles?: VehiclesFilterType;
  stations?: StationsFilterType;
};
