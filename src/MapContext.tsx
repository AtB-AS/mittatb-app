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

export const MapContextProvider: React.FC = ({children}) => {
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

export function useMapState() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapState must be used within a MapContextProvider');
  }
  return context;
}
