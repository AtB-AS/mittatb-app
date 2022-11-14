import {StopPlace, Quay} from '@atb/api/types/departures';
import {GeoLocation, Location, SearchLocation} from '@atb/favorites/types';
import {Feature, Point} from 'geojson';
import {Coordinates, MapLine} from '@atb/screens/TripDetails/Map/types';

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

export type MapSelectionActionType =
  | {
      source: 'map-click';
      feature: Feature<Point>;
    }
  | {
      source: 'my-position';
      coords: Coordinates;
    };

export type CameraFocusModeType =
  | {
      mode: 'map-lines';
      mapLines: MapLine[];
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
