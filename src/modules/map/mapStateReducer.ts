import {Feature, Point} from 'geojson';
import {MapBottomSheetType} from './MapContext';

export enum MapStateActionType {
  Vehicle = 'VEHICLE',
  VehicleScanned = 'VEHICLE_SCANNED',
  StopPlace = 'STOP_PLACE',
  ParkAndRideStation = 'PARK_AND_RIDE_STATION',
  Filter = 'FILTER',
  ExternalMap = 'EXTERNAL_MAP',
  FinishedBooking = 'FINISHED_BOOKING',
  Station = 'STATION',
  StationScanned = 'STATION_SCANNED',
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
  vehicleTypeId?: string;
  stationId?: string;
};

export type ReducerMapStateAction =
  | {
      type: MapStateActionType.Vehicle;
      feature: Feature<Point>;
      customZoomLevel?: number;
      vehicleTypeId?: string;
      stationId?: string;
    }
  | {
      type: MapStateActionType.VehicleScanned;
      assetId?: string;
      isStationBasedBooking?: boolean;
      vehicleTypeId?: string;
      stationId?: string;
    }
  | {
      type: MapStateActionType.Station;
      feature: Feature<Point>;
      customZoomLevel?: number;
    }
  | {
      type: MapStateActionType.StationScanned;
      assetId: string;
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
        isStationBasedBooking: mapState.isStationBasedBooking,
        vehicleTypeId: mapState.vehicleTypeId,
        stationId: mapState.stationId,
      };
    case MapStateActionType.VehicleScanned:
      return {
        bottomSheetType: MapBottomSheetType.Vehicle,
        assetId: action.assetId,
        assetIsScanned: true,
        isStationBasedBooking: action.isStationBasedBooking,
        vehicleTypeId: action.vehicleTypeId,
        stationId: action.stationId,
      };
    case MapStateActionType.Station:
      return {
        bottomSheetType: MapBottomSheetType.Station,
        feature: action.feature,
        customZoomLevel: action?.customZoomLevel,
      };
    case MapStateActionType.StationScanned:
      return {
        bottomSheetType: MapBottomSheetType.Station,
        assetId: action.assetId,
        assetIsScanned: true,
      };
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
