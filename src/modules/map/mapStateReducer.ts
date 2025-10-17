import {Feature, Point} from 'geojson';
import {MapBottomSheetType} from './MapContext';

export enum MapStateActionType {
  Scooter = 'SCOOTER',
  ScooterScanned = 'SCOOTER_SCANNED',
  Bicycle = 'BICYCLE',
  BicycleScanned = 'BICYCLE_SCANNED',
  BikeStation = 'BIKE_STATION',
  BikeStationScanned = 'BIKE_STATION_SCANNED',
  CarStation = 'CAR_STATION',
  CarStationScanned = 'CAR_STATION_SCANNED',
  StopPlace = 'STOP_PLACE',
  ParkAndRideStation = 'PARK_AND_RIDE_STATION',
  Filter = 'FILTER',
  ExternalMap = 'EXTERNAL_MAP',
  FinishedBooking = 'FINISHED_BOOKING',
  Station = 'STATION',
  SetSheetFullyOpened = 'SET_SHEET_FULLY_OPENED',
  //AutoDispatchOnMapFocus = 'AUTO_DISPATCH_ON_MAP_FOCUS',
  None = 'NONE',
}

export type ReducerMapState = {
  bottomSheetType: MapBottomSheetType;
  assetIsScanned?: boolean;
  assetId?: string;
  feature?: Feature<Point>;
  url?: string;
  eventToDispatch?: ReducerMapStateAction;
  bookingId?: string;
  customZoomLevel?: number;
  isFullyOpened?: boolean;
};

export type ReducerMapStateAction =
  | {
      type: MapStateActionType.Scooter;
      feature: Feature<Point>;
      customZoomLevel?: number;
      isFullyOpened: boolean;
    }
  | {
      type: MapStateActionType.ScooterScanned;
      assetId: string;
    }
  | {
      type: MapStateActionType.Bicycle;
      feature: Feature<Point>;
      customZoomLevel?: number;
      isFullyOpened: boolean;
    }
  | {
      type: MapStateActionType.BicycleScanned;
      assetId: string;
    }
  | {
      type: MapStateActionType.BikeStation;
      feature: Feature<Point>;
      customZoomLevel?: number;
      isFullyOpened: boolean;
    }
  | {
      type: MapStateActionType.BikeStationScanned;
      assetId: string;
    }
  | {
      type: MapStateActionType.CarStation;
      feature: Feature<Point>;
      customZoomLevel?: number;
      isFullyOpened: boolean;
    }
  | {
      type: MapStateActionType.CarStationScanned;
      assetId: string;
    }
  | {
      type: MapStateActionType.Station;
      feature: Feature<Point>;
      isFullyOpened: boolean;
    }
  | {
      type: MapStateActionType.ExternalMap;
      url: string;
    }
  | {
      type: MapStateActionType.Filter;
    }
  | {
      type: MapStateActionType.StopPlace;
      feature: Feature<Point>;
      isFullyOpened: boolean;
    }
  | {
      type: MapStateActionType.ParkAndRideStation;
      feature: Feature<Point>;
      isFullyOpened: boolean;
    }
  /*| {
      type: MapStateActionType.AutoDispatchOnMapFocus;
      eventToDispatch?: ReducerMapStateAction;
    }*/
  | {
      type: MapStateActionType.FinishedBooking;
      bookingId: string;
    }
  | {type: MapStateActionType.SetSheetFullyOpened; isFullyOpened: boolean}
  | {type: MapStateActionType.None};

export const mapStateReducer = (
  mapState: ReducerMapState,
  action: ReducerMapStateAction,
): ReducerMapState => {
  switch (action.type) {
    case MapStateActionType.Scooter:
      return {
        bottomSheetType: MapBottomSheetType.Scooter,
        feature: action.feature,
        customZoomLevel: action?.customZoomLevel,
        isFullyOpened: action.isFullyOpened,
      };
    case MapStateActionType.ScooterScanned:
      return {
        bottomSheetType: MapBottomSheetType.Scooter,
        assetId: action.assetId,
        assetIsScanned: true,
      };
    case MapStateActionType.Bicycle:
      return {
        bottomSheetType: MapBottomSheetType.Bicycle,
        feature: action.feature,
        customZoomLevel: action?.customZoomLevel,
        isFullyOpened: action.isFullyOpened,
      };
    case MapStateActionType.BicycleScanned:
      return {
        bottomSheetType: MapBottomSheetType.Bicycle,
        assetId: action.assetId,
        assetIsScanned: true,
      };
    case MapStateActionType.BikeStation:
      return {
        bottomSheetType: MapBottomSheetType.BikeStation,
        feature: action.feature,
        customZoomLevel: action?.customZoomLevel,
        isFullyOpened: action.isFullyOpened,
      };
    case MapStateActionType.BikeStationScanned:
      return {
        bottomSheetType: MapBottomSheetType.BikeStation,
        assetId: action.assetId,
        assetIsScanned: true,
      };
    case MapStateActionType.CarStation:
      return {
        bottomSheetType: MapBottomSheetType.CarStation,
        feature: action.feature,
        customZoomLevel: action?.customZoomLevel,
        isFullyOpened: action.isFullyOpened,
      };
    case MapStateActionType.CarStationScanned:
      return {
        bottomSheetType: MapBottomSheetType.CarStation,
        assetId: action.assetId,
        assetIsScanned: true,
      };
    case MapStateActionType.Station:
      return {
        bottomSheetType: MapBottomSheetType.Station,
        feature: action.feature,
        isFullyOpened: action.isFullyOpened,
      };
    /*case MapStateActionType.AutoDispatchOnMapFocus:
      return {
        mapState: BottomSheetType.AutoDispatchOnMapFocus,
        eventToDispatch: action.eventToDispatch
          ? {...action.eventToDispatch, eventToDispatch: undefined} // Setting undefined to avoid infinite loop
          : mapState,
      };*/
    case MapStateActionType.ExternalMap:
      return {
        bottomSheetType: MapBottomSheetType.ExternalMap,
        url: action.url,
      };
    case MapStateActionType.Filter:
      return {
        bottomSheetType: MapBottomSheetType.Filter,
      };
    case MapStateActionType.StopPlace:
      return {
        bottomSheetType: MapBottomSheetType.StopPlace,
        feature: action.feature,
        isFullyOpened: action.isFullyOpened,
      };
    case MapStateActionType.ParkAndRideStation:
      return {
        bottomSheetType: MapBottomSheetType.ParkAndRideStation,
        feature: action.feature,
        isFullyOpened: action.isFullyOpened,
      };
    case MapStateActionType.FinishedBooking:
      return {
        bottomSheetType: MapBottomSheetType.FinishedBooking,
        bookingId: action.bookingId,
      };
    case MapStateActionType.SetSheetFullyOpened:
      return {...mapState, isFullyOpened: action.isFullyOpened};
    case MapStateActionType.None:
      return {bottomSheetType: MapBottomSheetType.None};
    default:
      return mapState;
  }
};
