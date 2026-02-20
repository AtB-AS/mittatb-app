import React, {useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import {hitboxCoveringIconOnly, useMapSymbolStyles} from '@atb/modules/map';
import {Expression} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
import {PinType} from '../mapbox-styles/pin-types';
import {MapSlotLayerId} from '../hooks/use-mapbox-json-style';
import {
  StationFeaturePropertiesSchema,
  VehiclePropertiesSchema,
} from '@atb/api/types/mobility';

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

  const {iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureWithId?.properties?.id,
    pinType: pinType,
    reachFullScaleAtZoomLevel: 0,
    textSizeFactor: 1.61, // increased text size since the icon is larger
  });
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
        aboveLayerID={MapSlotLayerId.SelectedFeature}
        style={{
          ...customTextStyle,
          iconImage,
          iconAnchor: 'bottom',
          iconOffset: [0, 10], // compensation for shadow
          iconSize: 1,
          iconAllowOverlap: true,
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
      if (
        StationFeaturePropertiesSchema.safeParse(selectedFeatureProperties)
          .success
      ) {
        return 'station';
      }
      if (
        VehiclePropertiesSchema.safeParse(selectedFeatureProperties).success
      ) {
        return 'vehicle';
      }
      return 'unknown';
  }
}
