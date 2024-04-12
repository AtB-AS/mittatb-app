import MapboxGL from '@rnmapbox/maps';

import {FeatureCollection} from 'geojson';

import {usePreProcessedGeofencingZones} from '@atb/components/map';

export const GeofencingZones = () => {
  const preProcessedGeofencingZones = usePreProcessedGeofencingZones();

  const mappedGeofencingZones = preProcessedGeofencingZones.map(
    (geofencingZone) => (
      <MapboxGL.ShapeSource
        key={geofencingZone?.renderKey}
        id={'geofencingZonesShapeSource_' + geofencingZone?.renderKey}
        shape={geofencingZone.geojson as FeatureCollection} // todo: fix GeofencingZonesType in mobility-types_v2
        hitbox={{width: 1, height: 1}} // to not be able to hit multiple zones with one click
      >
        <MapboxGL.FillLayer
          id="parkingFill"
          style={{
            fillAntialias: true,
            fillColor: ['get', 'color', ['get', 'geofencingZoneCategoryProps']],
            fillOpacity: [
              'get',
              'fillOpacity',
              ['get', 'geofencingZoneCategoryProps'],
            ],
          }}
        />
        <MapboxGL.LineLayer
          id="tariffZonesLine"
          style={{
            lineWidth: 3,
            lineColor: ['get', 'color', ['get', 'geofencingZoneCategoryProps']],
            lineOpacity: [
              'get',
              'strokeOpacity',
              ['get', 'geofencingZoneCategoryProps'],
            ],
          }}
        />
      </MapboxGL.ShapeSource>
    ),
  );

  return <>{mappedGeofencingZones}</>;
};
