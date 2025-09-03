import {Feature, Point} from 'geojson';
import {AutoSelectableBottomSheetType} from './MapContext';

export type ReducerMapState = {
  mapState:
    | 'NONE'
    | 'AUTO_DISPATCH_ON_MAP_FOCUS'
    | 'MAP_SELECTION_ITEM'
    | 'STATION'
    | AutoSelectableBottomSheetType;
  assetId?: string | number;
  type?: AutoSelectableBottomSheetType;
  feature?: Feature<Point>;
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
      mapState: 'MAP_SELECTION_ITEM';
      feature?: Feature<Point>;
    }
  | {
      mapState: 'AUTO_DISPATCH_ON_MAP_FOCUS';
      eventToDispatch?: ReducerMapStateAction;
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
    case 'STATION':
      return {
        mapState: 'STATION',
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
    case 'MAP_SELECTION_ITEM':
      return {
        mapState: 'MAP_SELECTION_ITEM',
        feature: action.feature,
      };
    case 'AUTO_DISPATCH_ON_MAP_FOCUS':
      return {
        mapState: 'AUTO_DISPATCH_ON_MAP_FOCUS',
        eventToDispatch: action.eventToDispatch
          ? {...action.eventToDispatch, eventToDispatch: undefined} // Setting undefined to avoid infinite loop
          : mapState,
      };
    case 'NONE':
      return {mapState: 'NONE'};
    default:
      return mapState;
  }
};
