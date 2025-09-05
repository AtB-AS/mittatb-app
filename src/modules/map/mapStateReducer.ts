import {Feature, Point} from 'geojson';
import {AutoSelectableBottomSheetType} from './MapContext';

export type ReducerMapState = {
  mapState:
    | 'NONE'
    | 'AUTO_DISPATCH_ON_MAP_FOCUS'
    | 'STATION'
    | 'FINISHED_BOOKING'
    | 'EXTERNAL_MAP'
    | 'FILTER'
    | 'STOP_PLACE'
    | 'PARK_AND_RIDE'
    | AutoSelectableBottomSheetType;
  assetId?: string | number;
  type?: AutoSelectableBottomSheetType;
  feature?: Feature<Point>;
  url?: string;
  eventToDispatch?: ReducerMapStateAction;
};

export type ReducerMapStateAction =
  | {
      mapState: AutoSelectableBottomSheetType.Scooter;
      assetId?: string | number;
      feature?: Feature<Point>;
    }
  | {
      mapState: AutoSelectableBottomSheetType.Bicycle;
      assetId?: string | number;
      feature?: Feature<Point>;
    }
  | {
      mapState: AutoSelectableBottomSheetType.BikeStation;
      assetId?: string | number;
      feature?: Feature<Point>;
    }
  | {
      mapState: AutoSelectableBottomSheetType.CarStation;
      assetId?: string | number;
      feature?: Feature<Point>;
    }
  | {
      mapState: 'STATION';
      assetId?: string | number;
      feature?: Feature<Point>;
    }
  | {
      mapState: 'EXTERNAL_MAP';
      url?: string;
    }
  | {
      mapState: 'FILTER';
    }
  | {
      mapState: 'STOP_PLACE';
      feature?: Feature<Point>;
    }
  | {
      mapState: 'PARK_AND_RIDE';
      feature?: Feature<Point>;
    }
  | {
      mapState: 'AUTO_DISPATCH_ON_MAP_FOCUS';
      eventToDispatch?: ReducerMapStateAction;
    }
  | {
      mapState: 'FINISHED_BOOKING';
      assetId?: string | number;
    }
  | {mapState: 'NONE'};

export const mapStateReducer = (
  mapState: ReducerMapState,
  action: ReducerMapStateAction,
): ReducerMapState => {
  switch (action.mapState) {
    case AutoSelectableBottomSheetType.Scooter:
      return {
        mapState: AutoSelectableBottomSheetType.Scooter,
        assetId: action.assetId,
        feature: action.feature,
      };
    case AutoSelectableBottomSheetType.Bicycle:
      return {
        mapState: AutoSelectableBottomSheetType.Bicycle,
        assetId: action.assetId,
        feature: action.feature,
      };
    case AutoSelectableBottomSheetType.BikeStation:
      return {
        mapState: AutoSelectableBottomSheetType.BikeStation,
        feature: action.feature,
      };
    case AutoSelectableBottomSheetType.CarStation:
      return {
        mapState: AutoSelectableBottomSheetType.CarStation,
        assetId: action.assetId,
        feature: action.feature,
      };
    case 'STATION':
      return {
        mapState: 'STATION',
        assetId: action.assetId,
        feature: action.feature,
      };
    case 'AUTO_DISPATCH_ON_MAP_FOCUS':
      return {
        mapState: 'AUTO_DISPATCH_ON_MAP_FOCUS',
        eventToDispatch: action.eventToDispatch
          ? {...action.eventToDispatch, eventToDispatch: undefined} // Setting undefined to avoid infinite loop
          : mapState,
      };
    case 'EXTERNAL_MAP':
      return {
        mapState: 'EXTERNAL_MAP',
        url: action.url,
      };
    case 'FILTER':
      return {
        mapState: 'FILTER',
      };
    case 'STOP_PLACE':
      return {
        mapState: 'STOP_PLACE',
        feature: action.feature,
      };
    case 'PARK_AND_RIDE':
      return {
        mapState: 'PARK_AND_RIDE',
        feature: action.feature,
      };
    case 'FINISHED_BOOKING':
      return {
        mapState: 'FINISHED_BOOKING',
        assetId: action.assetId,
      };
    case 'NONE':
      return {mapState: 'NONE'};
    default:
      return mapState;
  }
};
