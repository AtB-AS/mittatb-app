import React, {createContext, useContext, useMemo, useState} from 'react';
import {AutoSelectableMapItem, MapFilterType} from '@atb/modules/map';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
type AutoSelectedFeature = Feature<Point, GeoJsonProperties> | undefined;
import {ShmoBookingState} from '@atb/api/types/mobility';
import {useUserMapFilters} from './hooks/use-map-filter';

type MapContextState = {
  bottomSheetToAutoSelect?: AutoSelectableBottomSheet;
  setBottomSheetToAutoSelect: (
    bottomSheetToAutoSelect?: AutoSelectableBottomSheet,
  ) => void;
  bottomSheetCurrentlyAutoSelected?: AutoSelectableBottomSheet;
  setBottomSheetCurrentlyAutoSelected: (
    bottomSheetToAutoSelect?: AutoSelectableBottomSheet,
  ) => void;
  setAutoSelectedMapItem: (mapItemToAutoSelect?: AutoSelectableMapItem) => void;
  autoSelectedFeature?: AutoSelectedFeature;
  mapFilter?: MapFilterType;
  setMapFilter: (mapFilter: MapFilterType) => void;
  mapFilterIsOpen: boolean;
  setMapFilterIsOpen: (mapFilterIsOpen: boolean) => void;
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

export type AutoSelectableBottomSheet = {
  type: AutoSelectableBottomSheetType;
  id: string;
  shmoBookingState?: ShmoBookingState;
};

type Props = {
  children: React.ReactNode;
};

export const MapContextProvider = ({children}: Props) => {
  const [bottomSheetToAutoSelect, setBottomSheetToAutoSelect] =
    useState<AutoSelectableBottomSheet>();

  const {mapFilter, setMapFilter} = useUserMapFilters();
  const [mapFilterIsOpen, setMapFilterIsOpen] = useState(false); // todo: refactor bottom sheet state to be declarative

  const [
    bottomSheetCurrentlyAutoSelected,
    setBottomSheetCurrentlyAutoSelected,
  ] = useState<AutoSelectableBottomSheet>();

  const [autoSelectedMapItem, setAutoSelectedMapItem] =
    useState<AutoSelectableMapItem>();

  // todo: support station selection
  const autoSelectedFeature: AutoSelectedFeature = useMemo(
    () =>
      !autoSelectedMapItem?.id
        ? undefined
        : {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [autoSelectedMapItem?.lon, autoSelectedMapItem?.lat],
            },
            // properties should match the one received from the map onPressEvent
            properties: {
              id: autoSelectedMapItem.id,
              system_id: autoSelectedMapItem?.system.id,
              count: 1,
              vehicle_type_form_factor:
                mapAutoSelectableBottomSheetTypeToFormFactor(
                  bottomSheetCurrentlyAutoSelected?.type,
                ),
            },
          },
    [autoSelectedMapItem, bottomSheetCurrentlyAutoSelected?.type],
  );

  return (
    <MapContext.Provider
      value={{
        bottomSheetToAutoSelect,
        setBottomSheetToAutoSelect,
        bottomSheetCurrentlyAutoSelected,
        setBottomSheetCurrentlyAutoSelected,
        setAutoSelectedMapItem,
        autoSelectedFeature,
        mapFilter,
        setMapFilter,
        mapFilterIsOpen,
        setMapFilterIsOpen,
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

function mapAutoSelectableBottomSheetTypeToFormFactor(
  autoSelectableBottomSheetType?: AutoSelectableBottomSheetType,
): FormFactor | undefined {
  switch (autoSelectableBottomSheetType) {
    case AutoSelectableBottomSheetType.Bicycle:
      return FormFactor.Bicycle;
    case AutoSelectableBottomSheetType.Scooter:
      return FormFactor.Scooter;
    case AutoSelectableBottomSheetType.BikeStation:
      return FormFactor.Bicycle;
    case AutoSelectableBottomSheetType.CarStation:
      return FormFactor.Car;
    default:
      return undefined;
  }
}
