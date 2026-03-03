import React, {useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {
  hitboxCoveringIconOnly,
  useMapContext,
  useMapSymbolStyles,
} from '@atb/modules/map';
import {SelectedFeatureIdProp} from '../../types';
import {OnPressEvent} from 'node_modules/@rnmapbox/maps/src/types/OnPressEvent';

import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {MapSlotLayerId} from '../../hooks/use-mapbox-json-style';
import {
  Expression,
  FilterExpression,
} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
import {scaleTransitionZoomRange} from '../../hooks/use-map-symbol-styles';

const vehiclesAndStationsVectorSourceId =
  'vehicles-clustered-and-stations-source';

export const VehiclesWithClusters = ({
  selectedFeatureId,
}: SelectedFeatureIdProp) => {
  const minZoomLevel = 14;
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureId,
    pinType: 'vehicle',
    reachFullScaleAtZoomLevel: minZoomLevel + scaleTransitionZoomRange + 0.3,
  });

  const filter: FilterExpression = useMemo(
    () => ['all', ['!', isSelected]],
    [isSelected],
  );

  const style = useMemo(
    () => ({
      ...iconStyle,
      ...textStyle,
    }),
    [iconStyle, textStyle],
  );

  return (
    <MapboxGL.SymbolLayer
      id="vehicles-clustered-symbol-layer"
      sourceID={vehiclesAndStationsVectorSourceId}
      sourceLayerID="combined_layer"
      minZoomLevel={minZoomLevel}
      aboveLayerID={MapSlotLayerId.Vehicles}
      filter={filter}
      style={style}
    />
  );
};

export const StationsWithClusters = ({
  selectedFeatureId,
  showNonVirtualStations,
}: SelectedFeatureIdProp & {
  showNonVirtualStations: boolean;
}) => {
  const showVirtualStations = false; // not supported yet. Also – consider using a virtualStationsFilter prop instead
  const minZoomLevel = 14;
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureId,
    pinType: 'station',
    reachFullScaleAtZoomLevel: minZoomLevel + scaleTransitionZoomRange + 0.2,
  });

  const {mapFilter} = useMapContext();
  const showCityBikes = mapFilter?.mobility.BICYCLE?.showAll ?? false;
  const showSharedCars = mapFilter?.mobility.CAR?.showAll ?? false;

  const filter: FilterExpression = useMemo(() => {
    const isVirtualStation: Expression = ['get', 'is_virtual_station'];
    const vehicle_type_form_factor: Expression = [
      'get',
      'vehicle_type_form_factor',
    ];
    return [
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
          ['!', !showCityBikes],
        ],
        [
          'all',
          ['==', vehicle_type_form_factor, 'CAR'],
          ['!', !showSharedCars],
        ],
      ],
    ];
  }, [
    isSelected,
    showVirtualStations,
    showNonVirtualStations,
    showCityBikes,
    showSharedCars,
  ]);

  const style = useMemo(
    () => ({
      ...iconStyle,
      ...textStyle,
      iconAllowOverlap: true,
    }),
    [iconStyle, textStyle],
  );

  return (
    <MapboxGL.SymbolLayer
      id="stations-symbol-layer"
      sourceID={vehiclesAndStationsVectorSourceId}
      sourceLayerID="combined_stations_layer"
      minZoomLevel={minZoomLevel}
      aboveLayerID={MapSlotLayerId.Stations}
      filter={filter}
      style={style}
    />
  );
};

// Vehicles and stations are grouped to optimize tile loading (limiting the number of requests)
export const VehiclesAndStations = ({
  selectedFeatureId,
  onPress,
  showVehicles,
  showStations,
}: SelectedFeatureIdProp & {
  onPress?: (e: OnPressEvent) => void;
  showVehicles: boolean;
  showStations: boolean;
}) => {
  // Could consider adding the sources only if shown.
  // The reason not to (for now), is to simplify potential cache tile hotloading on the server.
  const tileLayerNames: TileLayerName[] = [
    'vehicles_clustered',
    'stations_clustered',
  ];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames);
  const tileUrlTemplates = useMemo(
    () => [tileUrlTemplate || ''],
    [tileUrlTemplate],
  );

  if (!showVehicles && !showStations) return null;

  return (
    <MapboxGL.VectorSource
      id={vehiclesAndStationsVectorSourceId}
      tileUrlTemplates={tileUrlTemplates}
      minZoomLevel={14}
      maxZoomLevel={17}
      hitbox={hitboxCoveringIconOnly}
      onPress={onPress}
    >
      <>
        {!!showVehicles && (
          <VehiclesWithClusters selectedFeatureId={selectedFeatureId} />
        )}
        {!!showStations && (
          <StationsWithClusters
            selectedFeatureId={selectedFeatureId}
            showNonVirtualStations={true}
          />
        )}
      </>
    </MapboxGL.VectorSource>
  );
};
