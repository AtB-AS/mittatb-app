import {Quay, StopPlace} from '@atb/api/types/departures';
import {GeoLocation, Location, SearchLocation} from '@atb/favorites/types';
import {Feature, FeatureCollection, GeoJSON, LineString, Point} from 'geojson';
import {Coordinates} from '@atb/utils/coordinates';
import {
  Mode,
  PointsOnLink,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';

/**
 * MapSelectionMode: Parameter to decide how on-select/ on-click on the map
 * should behave
 *  - ExploreStops: If only the Stop Places (Bus, Trams stops etc.) should be
 *    interactable, and will open a bottom sheet with departures for the stop.
 *  - ExploreLocation: If every selected location should be interactable. It
 *    also shows the Location bar on top of the Map to show the currently
 *    selected location
 */
export type MapSelectionMode = 'ExploreStops' | 'ExploreLocation';

export type SelectionLocationCallback = (
  selectedLocation?: GeoLocation | SearchLocation,
) => void;
export type VehiclesState = {
  vehicles: FeatureCollection<GeoJSON.Point, VehicleFragment>;
  fetchVehicles: (coordinates: Coordinates, radius?: number) => void;
  onPress: (type: MapSelectionActionType) => void;
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
} & (
  | {
      selectionMode: 'ExploreLocation';
      onLocationSelect: SelectionLocationCallback;
    }
  | {
      selectionMode: 'ExploreStops';
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
      mode: 'stop-place';
      stopPlaceFeature: Feature<Point>;
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
