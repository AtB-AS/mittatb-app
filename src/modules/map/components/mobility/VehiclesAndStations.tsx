import React, {useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {hitboxCoveringIconOnly, useMapSymbolStyles} from '@atb/modules/map';
import {SelectedFeatureIdProp} from '../../types';
import {OnPressEvent} from 'node_modules/@rnmapbox/maps/src/types/OnPressEvent';

import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {
  MapSlotLayerId,
  StyleJsonVectorSource,
} from '../../hooks/use-mapbox-json-style';
import {
  Expression,
  FilterExpression,
} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';

import {
  hideItemsInTheDistanceFilter,
  scaleTransitionZoomRange,
} from '../../hooks/use-map-symbol-styles';

const vehiclesAndStationsVectorSourceId =
  'vehicles-clustered-and-stations-source';

export const VehiclesWithClusters = ({
  selectedFeatureId,
  showVehicles,
  showCarVehicles,
  hideSymbols = false,
}: SelectedFeatureIdProp & {
  showVehicles: boolean;
  showCarVehicles: boolean;
  hideSymbols?: boolean;
}) => {
  const minZoomLevel = 14;
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureId,
    pinType: 'vehicle',
    reachFullScaleAtZoomLevel: minZoomLevel + scaleTransitionZoomRange + 0.3,
  });

  const filter: {filter: FilterExpression} | undefined = useMemo(() => {
    // The tile layer carries cars, but they are toggled by their own map filter,
    // separate from the one covering scooters and free floating bikes.
    const isCar: Expression = [
      '==',
      ['get', 'vehicle_type_form_factor'],
      'CAR',
    ];
    return hideSymbols
      ? undefined
      : {
          filter: [
            'all',
            ['!', isSelected],
            [
              'any',
              ['all', isCar, showCarVehicles],
              ['all', ['!', isCar], showVehicles],
            ],
            hideItemsInTheDistanceFilter,
          ],
        };
  }, [isSelected, hideSymbols, showVehicles, showCarVehicles]);

  const style = useMemo(
    () => ({
      ...iconStyle,
      ...textStyle,
    }),
    [iconStyle, textStyle],
  );

  return (
    <MapboxGL.SymbolLayer
      id={`vehicles-clustered-symbol-layer-${
        hideSymbols ? 'hidden' : 'visible'
      }`}
      sourceID={vehiclesAndStationsVectorSourceId}
      sourceLayerID="combined_layer"
      minZoomLevel={minZoomLevel}
      aboveLayerID={MapSlotLayerId.Vehicles}
      style={hideSymbols ? {} : style}
      {...filter}
    />
  );
};

export const StationsWithClusters = ({
  selectedFeatureId,
  showNonVirtualStations,
  showCityBikeStations,
  showSharedCarStations,
  hideSymbols = false,
  showBikeStationParkingInfo = false,
}: SelectedFeatureIdProp & {
  showNonVirtualStations: boolean;
  showCityBikeStations: boolean;
  showSharedCarStations: boolean;
  hideSymbols?: boolean;
  showBikeStationParkingInfo?: boolean;
}) => {
  const showVirtualStations = false; // not supported yet. Also – consider using a virtualStationsFilter prop instead
  const minZoomLevel = 14;
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    // During an active trip the selected feature id is the *rented vehicle's* id, which no
    // station matches - that minimizes every station and blanks out its label. No station is
    // selected in that state anyway, so deliberately pass none while showing parking info.
    selectedFeaturePropertyId: showBikeStationParkingInfo
      ? undefined
      : selectedFeatureId,
    pinType: 'station',
    reachFullScaleAtZoomLevel: minZoomLevel + scaleTransitionZoomRange + 0.2,
    showBikeStationParkingInfo,
  });

  const filter: {filter: FilterExpression} | undefined = useMemo(() => {
    const isVirtualStation: Expression = ['get', 'is_virtual_station'];
    const vehicle_type_form_factor: Expression = [
      'get',
      'vehicle_type_form_factor',
    ];
    return hideSymbols
      ? undefined
      : {
          filter: [
            'all',
            ['!', isSelected],
            [
              'any',
              ['==', isVirtualStation, showVirtualStations],
              ['!=', isVirtualStation, showNonVirtualStations],
            ],
            [
              'any',
              [
                'all',
                ['==', vehicle_type_form_factor, 'BICYCLE'],
                ['!', !showCityBikeStations],
              ],
              [
                'all',
                ['==', vehicle_type_form_factor, 'CAR'],
                ['!', !showSharedCarStations],
              ],
            ],
            hideItemsInTheDistanceFilter,
          ],
        };
  }, [
    isSelected,
    showVirtualStations,
    showNonVirtualStations,
    showCityBikeStations,
    showSharedCarStations,
    hideSymbols,
  ]);

  const style = useMemo(
    () => ({
      ...iconStyle,
      ...textStyle,
      iconAllowOverlap: true,
    }),
    [iconStyle, textStyle],
  );

  // Stations normally render below NSR items, so a nearby stop place can cover a
  // station icon and its label. While showing parking info the free-slots count is
  // what the user is navigating by, so stations are lifted above the stop places.
  const slotLayerId = showBikeStationParkingInfo
    ? MapSlotLayerId.StationsAboveNsrItems
    : MapSlotLayerId.Stations;

  return (
    <MapboxGL.SymbolLayer
      id={`stations-clustered-symbol-layer-${
        hideSymbols ? 'hidden' : 'visible'
      }`}
      sourceID={vehiclesAndStationsVectorSourceId}
      sourceLayerID="combined_stations_layer"
      minZoomLevel={minZoomLevel}
      aboveLayerID={slotLayerId}
      style={hideSymbols ? {} : style}
      {...filter}
    />
  );
};

// Vehicles and stations are grouped to optimize tile loading (limiting the number of requests)
export const VehiclesAndStations = ({
  selectedFeatureId,
  onPress,
  showVehicles,
  showCarVehicles,
  showCityBikeStations,
  showSharedCarStations,
  showBikeStationParkingInfo = false,
}: SelectedFeatureIdProp & {
  onPress?: (e: OnPressEvent) => void;
  showVehicles: boolean;
  showCarVehicles: boolean;
  showCityBikeStations: boolean;
  showSharedCarStations: boolean;
  showBikeStationParkingInfo?: boolean;
}) => {
  const showStations = showCityBikeStations || showSharedCarStations;
  const showAnyVehicles = showVehicles || showCarVehicles;
  if (!showAnyVehicles && !showStations) return null;

  return (
    <MapboxGL.VectorSource
      id={vehiclesAndStationsVectorSourceId}
      existing={true}
      hitbox={hitboxCoveringIconOnly}
      onPress={onPress}
    >
      <>
        {!!showAnyVehicles && (
          <VehiclesWithClusters
            selectedFeatureId={selectedFeatureId}
            showVehicles={showVehicles}
            showCarVehicles={showCarVehicles}
          />
        )}
        {!!showStations && (
          <StationsWithClusters
            selectedFeatureId={selectedFeatureId}
            showNonVirtualStations={true}
            showCityBikeStations={showCityBikeStations}
            showSharedCarStations={showSharedCarStations}
            showBikeStationParkingInfo={showBikeStationParkingInfo}
          />
        )}
      </>
    </MapboxGL.VectorSource>
  );
};

/**
 * In order to only store live data in memory, not in the locally stored cache,
 * volatile should be set to true. However, since rnmapbox doesn't yet support
 * this prop on MapboxGL.VectorSource (see https://github.com/rnmapbox/maps/discussions/3351),
 * the source must instead be sent directly as styleJson. MapboxGL.VectorSource can
 * then access this source with existing=true and the same source id.
 * @returns {id: string, source: StyleJsonVectorSource}
 */
export const useVehiclesAndStationsVectorSource: () => {
  id: string;
  source: StyleJsonVectorSource;
} = () => {
  // Could consider adding the sources only if shown.
  // The reason not to, is to simplify potential cache tile hotloading on the server.
  const tileLayerNames: TileLayerName[] = [
    'vehicles_clustered_v3',
    'stations_clustered_v2',
  ];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames);

  return useMemo(
    () => ({
      id: vehiclesAndStationsVectorSourceId,
      source: {
        type: 'vector',
        tiles: [tileUrlTemplate || ''],
        minzoom: 14,
        maxzoom: 17,
        volatile: true,
      },
    }),
    [tileUrlTemplate],
  );
};
