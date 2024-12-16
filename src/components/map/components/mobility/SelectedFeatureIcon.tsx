import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import {hitboxCoveringIconOnly} from '../../utils';
import {MAP_ICONS_PIXEL_RATIO} from '../../mapIcons/mapIcons';
import {useMapSymbolStyles} from '@atb/components/map';

export const SelectedFeatureIcon = ({
  selectedFeature,
  useToggledIconName,
}: {
  selectedFeature: Feature<Point, GeoJsonProperties> | undefined;
  useToggledIconName: boolean;
}) => {
  const pinType =
    selectedFeature?.properties?.is_virtual_station !== undefined
      ? 'station'
      : 'vehicle';
  const {iconStyle, textStyle} = useMapSymbolStyles(
    selectedFeature,
    pinType,
    useToggledIconName,
    1.61,
  );
  if (!selectedFeature) {
    return null;
  }

  const numVehiclesAvailable = ['get', 'num_vehicles_available'];

  const textField =
    pinType == 'station' ? ['to-string', numVehiclesAvailable] : '';

  const numberOfUnits = pinType == 'station' ? numVehiclesAvailable : 1;

  const textOffset = [
    'step',
    numberOfUnits,
    [0.9, -1.3],
    100,
    [1.1, -1.5],
    1000,
    [1.4, -2.0],
  ];

  const customTextStyle = {
    ...textStyle,
    textField,
    textOffset,
  };

  return (
    <MapboxGL.ShapeSource
      id="selected-vehicle-source"
      shape={selectedFeature}
      hitbox={hitboxCoveringIconOnly}
    >
      <MapboxGL.SymbolLayer
        id="selected-vehicle-symbol-layer"
        style={{
          ...customTextStyle,
          iconImage: iconStyle.iconImage,
          iconAnchor: 'bottom',
          iconOffset: [0, 10 * MAP_ICONS_PIXEL_RATIO], // compensate for shadow
          iconSize: 1 / MAP_ICONS_PIXEL_RATIO,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
