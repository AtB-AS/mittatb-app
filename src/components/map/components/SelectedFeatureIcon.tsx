import React, {useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import {hitboxCoveringIconOnly, useMapSymbolStyles} from '@atb/components/map';
import {Expression} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {PinType} from '../mapbox-styles/pin-types';

export const SelectedFeatureIcon = ({
  selectedFeature,
}: {
  selectedFeature?: Feature<Point, GeoJsonProperties>;
}) => {
  const selectedFeatureWithId = useMemo(
    () =>
      !!selectedFeature
        ? {...selectedFeature, id: selectedFeature?.properties?.id} // fixes a bug (crash) on Android for when selectedFeature.id is undefined
        : undefined,
    [selectedFeature],
  );

  const pinType = getPinType(selectedFeatureWithId?.properties);

  const {iconStyle, textStyle} = useMapSymbolStyles(
    selectedFeatureWithId?.properties?.id,
    pinType,
    1.61, // increased text size since the icon is larger
  );
  const {iconImage} = iconStyle;
  if (!selectedFeatureWithId) {
    return null;
  }

  const numVehiclesAvailable: Expression = ['get', 'num_vehicles_available'];

  const textField: Expression = [
    'to-string',
    pinType == 'station' ? numVehiclesAvailable : '',
  ];

  const numberOfUnits: Expression = [
    'to-number',
    pinType == 'station' ? numVehiclesAvailable : 1,
  ];

  const textOffset: Expression = [
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
      shape={selectedFeatureWithId}
      hitbox={hitboxCoveringIconOnly}
    >
      <MapboxGL.SymbolLayer
        id="selected-vehicle-symbol-layer"
        style={{
          ...customTextStyle,
          iconImage,
          iconAnchor: 'bottom',
          iconOffset: [0, 10], // compensation for shadow
          iconSize: 1,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

function getPinType(selectedFeatureProperties?: GeoJsonProperties): PinType {
  switch (selectedFeatureProperties?.entityType) {
    case 'StopPlace':
    case 'Parking':
    case 'Quay':
      return 'stop';
    default:
      if (selectedFeatureProperties?.is_virtual_station !== undefined) {
        return 'station';
      } else {
        return 'vehicle';
      }
  }
}
