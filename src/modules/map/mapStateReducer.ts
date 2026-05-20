import {Feature, Point} from 'geojson';
import {MapBottomSheetType} from './MapContext';

export enum MapStateActionType {
  Vehicle = 'VEHICLE',
  VehicleScanned = 'VEHICLE_SCANNED',
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
  isStationBasedBooking?: boolean;
};

export type ReducerMapStateAction =
  | {
      type: MapStateActionType.Vehicle;
      feature: Feature<Point>;
      customZoomLevel?: number;
    }
  | {
      type: MapStateActionType.VehicleScanned;
      assetId: string;
      isStationBasedBooking?: boolean;
    }
  | {
      type: MapStateActionType.BikeStation;
      feature: Feature<Point>;
      customZoomLevel?: number;
    }
  | {
      type: MapStateActionType.BikeStationScanned;
      assetId: string;
    }
  | {
      type: MapStateActionType.CarStation;
      feature: Feature<Point>;
      customZoomLevel?: number;
    }
  | {
      type: MapStateActionType.CarStationScanned;
      assetId: string;
    }
  | {
      type: MapStateActionType.Station;
      feature: Feature<Point>;
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
    }
  | {
      type: MapStateActionType.ParkAndRideStation;
      feature: Feature<Point>;
    }
  /*| {
      type: MapStateActionType.AutoDispatchOnMapFocus;
      eventToDispatch?: ReducerMapStateAction;
    }*/
  | {
      type: MapStateActionType.FinishedBooking;
      bookingId: string;
    }
  | {type: MapStateActionType.None};

export const mapStateReducer = (
  mapState: ReducerMapState,
  action: ReducerMapStateAction,
): ReducerMapState => {
  switch (action.type) {
    case MapStateActionType.Vehicle:
      return {
        bottomSheetType: MapBottomSheetType.Vehicle,
        feature: action.feature,
        customZoomLevel: action?.customZoomLevel,
      };
    case MapStateActionType.VehicleScanned:
      return {
        bottomSheetType: MapBottomSheetType.Vehicle,
        assetId: action.assetId,
        assetIsScanned: true,
        isStationBasedBooking: action.isStationBasedBooking,
      };
    case MapStateActionType.BikeStation:
      return {
        bottomSheetType: MapBottomSheetType.BikeStation,
        feature: action.feature,
        customZoomLevel: action?.customZoomLevel,
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
      };
    case MapStateActionType.ParkAndRideStation:
      return {
        bottomSheetType: MapBottomSheetType.ParkAndRideStation,
        feature: action.feature,
      };
    case MapStateActionType.FinishedBooking:
      return {
        bottomSheetType: MapBottomSheetType.FinishedBooking,
        bookingId: action.bookingId,
      };
    case MapStateActionType.None:
      return {bottomSheetType: MapBottomSheetType.None};
    default:
      return mapState;
  }
};
