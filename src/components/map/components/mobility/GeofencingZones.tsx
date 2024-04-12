import MapboxGL from '@rnmapbox/maps';
import {GeofencingZones as GeofencingZonesType} from '@atb/api/types/generated/mobility-types_v2';
import {FeatureCollection} from 'geojson';

type GeofencingZonesProps = {
  geofencingZones: GeofencingZonesType[];
};

export const GeofencingZones = ({geofencingZones}: GeofencingZonesProps) => {
  const mappedGeofencingZones = geofencingZones
    .filter((gfz) => !!gfz.geojson)
    .map((geofencingZone) => (
      <MapboxGL.ShapeSource
        key={geofencingZone['renderKey']} // todo: yes it is defined, fix type
        id="geofencingZonesShapeSource"
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
            ], //['*', ['get', 'opacity'], 1.5],
          }}
        />
      </MapboxGL.ShapeSource>
    ));

  return <>{mappedGeofencingZones}</>;
};
