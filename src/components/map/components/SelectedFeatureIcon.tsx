import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import {hitboxCoveringIconOnly, useMapSymbolStyles} from '@atb/components/map';

export const SelectedFeatureIcon = ({
  selectedFeature,
}: {
  selectedFeature?: Feature<Point, GeoJsonProperties>;
}) => {
  const pinType =
    selectedFeature?.properties?.entityType === 'StopPlace' ||
    selectedFeature?.properties?.entityType === 'Parking' ||
    selectedFeature?.properties?.entityType === 'Quay'
      ? 'stop'
      : selectedFeature?.properties?.vehicleTypesAvailable !== undefined // use is_virtual_station instead when using vector source
      ? 'station'
      : 'vehicle';

  const {iconStyle, textStyle} = useMapSymbolStyles(
    selectedFeature?.properties?.id,
    pinType,
    1.61,
  );
  if (!selectedFeature) {
    return null;
  }

  const numVehiclesAvailable = ['get', 'count']; // switch to num_vehicles_available when using vector source

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
          iconOffset: [0, 10], // compensation for shadow
          iconSize: 1,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
