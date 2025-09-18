import React, {createContext, useContext, useReducer} from 'react';
import {MapFilterType} from '@atb/modules/map';
import {useUserMapFilters} from './hooks/use-map-filter';
import {
  mapStateReducer,
  ReducerMapState,
  ReducerMapStateAction,
} from './mapStateReducer';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type MapContextState = {
  mapFilter?: MapFilterType;
  setMapFilter: (mapFilter: MapFilterType) => void;
  mapState: ReducerMapState;
  dispatchMapState: React.Dispatch<ReducerMapStateAction>;
};

const MapContext = createContext<MapContextState | undefined>(undefined);

export enum MapBottomSheetType {
  Scooter = 'SCOOTER',
  Bicycle = 'BICYCLE',
  BikeStation = 'BIKE_STATION',
  CarStation = 'CAR_STATION',
  StopPlace = 'STOP_PLACE',
  ParkAndRideStation = 'PARK_AND_RIDE_STATION',
  Filter = 'FILTER',
  ExternalMap = 'EXTERNAL_MAP',
  FinishedBooking = 'FINISHED_BOOKING',
  Station = 'STATION',
  AutoDispatchOnMapFocus = 'AUTO_DISPATCH_ON_MAP_FOCUS',
  None = 'NONE',
}

type Props = {
  children: React.ReactNode;
};

export const MapContextProvider = ({children}: Props) => {
  const [mapState, dispatchMapState] = useReducer(mapStateReducer, {
    bottomSheetType: MapBottomSheetType.None,
  });

  const {mapFilter, setMapFilter} = useUserMapFilters();

  return (
    <MapContext.Provider
      value={{
        mapFilter,
        setMapFilter,
        mapState,
        dispatchMapState,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

/**
 * Originally, all map items were only possible to select by clicking on an item on the map.
 * This meant the user was always in the map already, and the map item already existed,
 * which allowed the BottomSheet to be opened immediately based on the map item.
 *
 * Now, with QR code scan to select, a different flow is used. The bottom sheet should only
 * be opened once returning to the map screen, and also there is no guarantee that the map
 * is already in the right place with the map item in state or view.
 *
 * This new flow is what autoSelect is about. First you update the state for what you want
 * to be selected in the bottomSheet. Then the next time the map is in view, useAutoSelectMapItem
 * will select it automatically.
 */
export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapState must be used within a MapContextProvider');
  }
  return context;
}

export function mapAutoSelectableBottomSheetTypeToFormFactor(
  autoSelectableBottomSheetType?: MapBottomSheetType,
): FormFactor | undefined {
  switch (autoSelectableBottomSheetType) {
    case MapBottomSheetType.Bicycle:
      return FormFactor.Bicycle;
    case MapBottomSheetType.Scooter:
      return FormFactor.Scooter;
    case MapBottomSheetType.BikeStation:
      return FormFactor.Bicycle;
    case MapBottomSheetType.CarStation:
      return FormFactor.Car;
    default:
      return undefined;
  }
}
