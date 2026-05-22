import {FareZone, getReferenceDataName} from '@atb/modules/configuration';
import {Language} from '@atb/translations';
import {decodePolylineEncodedGeometry} from '@atb/utils/decode-polyline-geometry';
import {FeatureCollection, Polygon} from 'geojson';

export const mapZonesToPolygonCollection = (
  zones: FareZone[],
  language: Language,
): FeatureCollection<Polygon> => ({
  type: 'FeatureCollection',
  features: zones.map((t) => ({
    type: 'Feature',
    id: t.id,
    properties: {name: getReferenceDataName(t, language)},
    geometry: decodePolylineEncodedGeometry(t.geometry),
  })),
});
