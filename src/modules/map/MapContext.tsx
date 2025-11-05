import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {MapFilterType} from '@atb/modules/map';
import {useUserMapFilters} from './hooks/use-map-filter';
import {
  mapStateReducer,
  ReducerMapState,
  ReducerMapStateAction,
} from './mapStateReducer';
import {usePersistedBoolState} from '@atb/utils/use-persisted-bool-state';
import {storage, StorageModelKeysEnum} from '@atb/modules/storage';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import MapboxGL from '@rnmapbox/maps';
import {useRemoteConfigContext} from '../remote-config';

type MapContextState = {
  mapFilter?: MapFilterType;
  setMapFilter: (mapFilter: MapFilterType) => void;
  mapState: ReducerMapState;
  dispatchMapState: React.Dispatch<ReducerMapStateAction>;
  paddingBottomMap: number;
  setPaddingBottomMap: (value: number) => void;
  givenShmoConsent: boolean;
  setGivenShmoConsent: (value: boolean) => void;
  currentBottomSheet: {
    isFullyOpen: boolean;
    bottomSheetType: MapBottomSheetType;
    feature: Feature<Point, GeoJsonProperties> | null;
  };
  setCurrentBottomSheet: (value: {
    isFullyOpen: boolean;
    bottomSheetType: MapBottomSheetType;
    feature: Feature<Point, GeoJsonProperties> | null;
  }) => void;
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
  const {mapboxApiToken} = useRemoteConfigContext();
  useEffect(() => {
    MapboxGL.setAccessToken(mapboxApiToken);
  }, [mapboxApiToken]);

  const [mapState, dispatchMapState] = useReducer(mapStateReducer, {
    bottomSheetType: MapBottomSheetType.None,
  });

  const [givenShmoConsent, setGivenShmoConsent] = usePersistedBoolState(
    storage,
    StorageModelKeysEnum.ScooterConsent,
    false,
  );

  const {mapFilter, setMapFilter} = useUserMapFilters();

  const [currentBottomSheet, setCurrentBottomSheet] = useState<{
    isFullyOpen: boolean;
    bottomSheetType: MapBottomSheetType;
    feature: Feature<Point, GeoJsonProperties> | null;
  }>({
    isFullyOpen: false,
    bottomSheetType: MapBottomSheetType.None,
    feature: null,
  });

  const [paddingBottomMap, setPaddingBottomMap] = useState(0);

  return (
    <MapContext.Provider
      value={{
        mapFilter,
        setMapFilter,
        mapState,
        dispatchMapState,
        paddingBottomMap,
        setPaddingBottomMap,
        givenShmoConsent,
        setGivenShmoConsent,
        currentBottomSheet,
        setCurrentBottomSheet,
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
