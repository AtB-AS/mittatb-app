import {Feature, Point} from 'geojson';
import {BottomSheetType} from './MapContext';

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
  AutoDispatchOnMapFocus = 'AUTO_DISPATCH_ON_MAP_FOCUS',
  None = 'NONE',
}

export type ReducerMapState = {
  mapState: BottomSheetType;
  assetId?: string | number;
  feature?: Feature<Point>;
  url?: string;
  eventToDispatch?: ReducerMapStateAction;
};

export type ReducerMapStateAction =
  | {
      type: MapStateActionType.Scooter;
      assetId: string | number;
      feature: Feature<Point>;
    }
  | {
      type: MapStateActionType.ScooterScanned;
      assetId: string | number;
    }
  | {
      type: MapStateActionType.Bicycle;
      assetId: string | number;
      feature: Feature<Point>;
    }
  | {
      type: MapStateActionType.BicycleScanned;
      assetId: string | number;
    }
  | {
      type: MapStateActionType.BikeStation;
      assetId: string | number;
      feature: Feature<Point>;
    }
  | {
      type: MapStateActionType.BikeStationScanned;
      assetId: string | number;
    }
  | {
      type: MapStateActionType.CarStation;
      assetId: string | number;
      feature: Feature<Point>;
    }
  | {
      type: MapStateActionType.CarStationScanned;
      assetId: string | number;
    }
  | {
      type: MapStateActionType.Station;
      assetId: string | number;
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
      assetId: string | number;
    }
  | {type: MapStateActionType.None};

export const mapStateReducer = (
  mapState: ReducerMapState,
  action: ReducerMapStateAction,
): ReducerMapState => {
  switch (action.type) {
    case MapStateActionType.Scooter:
      return {
        mapState: BottomSheetType.Scooter,
        assetId: action.assetId,
        feature: action.feature,
      };
    case MapStateActionType.ScooterScanned:
      return {
        mapState: BottomSheetType.Scooter,
        assetId: action.assetId,
      };
    case MapStateActionType.Bicycle:
      return {
        mapState: BottomSheetType.Bicycle,
        assetId: action.assetId,
        feature: action.feature,
      };
    case MapStateActionType.BicycleScanned:
      return {
        mapState: BottomSheetType.Bicycle,
        assetId: action.assetId,
      };
    case MapStateActionType.BikeStation:
      return {
        mapState: BottomSheetType.BikeStation,
        feature: action.feature,
        assetId: action.assetId,
      };
    case MapStateActionType.BikeStationScanned:
      return {
        mapState: BottomSheetType.BikeStation,
        assetId: action.assetId,
      };
    case MapStateActionType.CarStation:
      return {
        mapState: BottomSheetType.CarStation,
        assetId: action.assetId,
        feature: action.feature,
      };
    case MapStateActionType.CarStationScanned:
      return {
        mapState: BottomSheetType.CarStation,
        assetId: action.assetId,
      };
    case MapStateActionType.Station:
      return {
        mapState: BottomSheetType.Station,
        assetId: action.assetId,
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
        mapState: BottomSheetType.ExternalMap,
        url: action.url,
      };
    case MapStateActionType.Filter:
      return {
        mapState: BottomSheetType.Filter,
      };
    case MapStateActionType.StopPlace:
      return {
        mapState: BottomSheetType.StopPlace,
        feature: action.feature,
      };
    case MapStateActionType.ParkAndRideStation:
      return {
        mapState: BottomSheetType.ParkAndRideStation,
        feature: action.feature,
      };
    case MapStateActionType.FinishedBooking:
      return {
        mapState: BottomSheetType.FinishedBooking,
        assetId: action.assetId,
      };
    case MapStateActionType.None:
      return {mapState: BottomSheetType.None};
    default:
      return mapState;
  }
};
