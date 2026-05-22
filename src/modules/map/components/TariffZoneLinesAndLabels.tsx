import MapboxGL from '@rnmapbox/maps';
import {Expression} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
import turfCentroid from '@turf/centroid';
import {FeatureCollection, Point, Polygon} from 'geojson';
import React from 'react';
import {useThemeContext} from '@atb/theme';

const labelZoomOpacity: Expression = [
  'interpolate',
  ['linear'],
  ['zoom'],
  4.3,
  0,
  4.5,
  1,
  10,
  1,
  10.5,
  0,
];

type TariffZonesProps = {
  polygonCollection: FeatureCollection<Polygon>;
  showLabelsAtAllZoom?: boolean;
};

export const TariffZoneLinesAndLabels = ({
  polygonCollection,
  showLabelsAtAllZoom,
}: TariffZonesProps) => {
  const {theme} = useThemeContext();

  const labelPointsCollection =
    mapPolygonsToLabelPointsCollection(polygonCollection);

  return (
    <>
      <MapboxGL.ShapeSource id="tariffZonesShape" shape={polygonCollection}>
        <MapboxGL.LineLayer
          id="tariffZonesLine"
          style={{
            lineWidth: 2,
            lineColor: theme.color.foreground.dynamic.secondary,
            lineEmissiveStrength: 1,
          }}
        />
      </MapboxGL.ShapeSource>

      <MapboxGL.ShapeSource id="tariffZoneLabels" shape={labelPointsCollection}>
        <MapboxGL.SymbolLayer
          id="tariffZoneLabelText"
          style={{
            textField: ['get', 'name'],
            textSize: 20,
            textHaloColor: 'white',
            textHaloWidth: 2,
            iconEmissiveStrength: 1,
            textOpacity: showLabelsAtAllZoom ? 1 : labelZoomOpacity,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};

const mapPolygonsToLabelPointsCollection = (
  polygonCollection: FeatureCollection<Polygon>,
): FeatureCollection<Point> => ({
  type: 'FeatureCollection',
  features: polygonCollection.features.map((f) => {
    const centroid = turfCentroid(f.geometry);
    return {
      type: 'Feature',
      id: f.id,
      properties: {name: f.properties?.name},
      geometry: centroid.geometry,
    };
  }),
});
