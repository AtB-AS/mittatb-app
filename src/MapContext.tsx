import React, {createContext, useContext, useState} from 'react';

type MapContextState = {
  bottomSheetToAutoSelect?: AutoSelectableBottomSheet;
  setBottomSheetToAutoSelect: (
    bottomSheetToAutoSelect?: AutoSelectableBottomSheet,
  ) => void;
  bottomSheetCurrentlyAutoSelected?: AutoSelectableBottomSheet;
  setBottomSheetCurrentlyAutoSelected: (
    bottomSheetToAutoSelect?: AutoSelectableBottomSheet,
  ) => void;
};

const MapContext = createContext<MapContextState | undefined>(undefined);

export enum AutoSelectableBottomSheetType {
  Scooter = 'SCOOTER',
  Bicycle = 'BICYCLE',
  BikeStation = 'BIKE_STATION',
  CarStation = 'CAR_STATION',
  // StopPlace = 'STOP_PLACE', // add support if needed
  // ParkAndRideStation = 'PARK_AND_RIDE_STATION', // add support if needed
}

type AutoSelectableBottomSheet = {
  type: AutoSelectableBottomSheetType;
  id: string;
};

type Props = {
  children: React.ReactNode;
};

export const MapContextProvider = ({children}: Props) => {
  const [bottomSheetToAutoSelect, setBottomSheetToAutoSelect] =
    useState<AutoSelectableBottomSheet>();

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
