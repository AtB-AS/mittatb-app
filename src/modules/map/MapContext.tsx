import React, {createContext, useContext, useReducer, useState} from 'react';
import {MapFilterType} from '@atb/modules/map';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {useUserMapFilters} from './hooks/use-map-filter';
import {
  mapStateReducer,
  ReducerMapState,
  ReducerMapStateAction,
} from './mapStateReducer';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type MapContextState = {
  bottomSheetToAutoSelect?: AutoSelectableBottomSheet;
  setBottomSheetToAutoSelect: (
    bottomSheetToAutoSelect?: AutoSelectableBottomSheet,
  ) => void;
  bottomSheetCurrentlyAutoSelected?: AutoSelectableBottomSheet;
  setBottomSheetCurrentlyAutoSelected: (
    bottomSheetToAutoSelect?: AutoSelectableBottomSheet,
  ) => void;
  mapFilter?: MapFilterType;
  setMapFilter: (mapFilter: MapFilterType) => void;
  mapFilterIsOpen: boolean;
  setMapFilterIsOpen: (mapFilterIsOpen: boolean) => void;
  mapSelectionState: ReducerMapState;
  mapSelectionDispatch: React.Dispatch<ReducerMapStateAction>;
};

const MapContext = createContext<MapContextState | undefined>(undefined);

export enum BottomSheetType {
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

export type AutoSelectableBottomSheet = {
  type: BottomSheetType;
  id: string;
  shmoBookingState?: ShmoBookingState;
};

type Props = {
  children: React.ReactNode;
};

export const MapContextProvider = ({children}: Props) => {
  const [bottomSheetToAutoSelect, setBottomSheetToAutoSelect] =
    useState<AutoSelectableBottomSheet>();
  const [mapSelectionState, mapSelectionDispatch] = useReducer(
    mapStateReducer,
    {
      mapState: BottomSheetType.None,
    },
  );

  const {mapFilter, setMapFilter} = useUserMapFilters();
  const [mapFilterIsOpen, setMapFilterIsOpen] = useState(false);

  const [
    bottomSheetCurrentlyAutoSelected,
    setBottomSheetCurrentlyAutoSelected,
  ] = useState<AutoSelectableBottomSheet>();

  return (
    <MapContext.Provider
      value={{
        bottomSheetToAutoSelect,
        setBottomSheetToAutoSelect,
        bottomSheetCurrentlyAutoSelected,
        setBottomSheetCurrentlyAutoSelected,
        mapFilter,
        setMapFilter,
        mapFilterIsOpen,
        setMapFilterIsOpen,
        mapSelectionState,
        mapSelectionDispatch,
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
  autoSelectableBottomSheetType?: BottomSheetType,
): FormFactor | undefined {
  switch (autoSelectableBottomSheetType) {
    case BottomSheetType.Bicycle:
      return FormFactor.Bicycle;
    case BottomSheetType.Scooter:
      return FormFactor.Scooter;
    case BottomSheetType.BikeStation:
      return FormFactor.Bicycle;
    case BottomSheetType.CarStation:
      return FormFactor.Car;
    default:
      return undefined;
  }
}
