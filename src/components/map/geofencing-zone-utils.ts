import {Feature} from '@atb/api/types/generated/mobility-types_v2';

import {
  GeofencingZoneCategoriesProps,
  GeofencingZoneCategoryKey,
  GeofencingZoneCategoryProps,
  PreProcessedGeofencingZones,
} from '@atb/components/map';
import polyline from '@mapbox/polyline';

export function sortFeaturesByLayerIndexWeight(
  geofencingZones: PreProcessedGeofencingZones[],
) {
  geofencingZones.forEach((geofencingZone) => {
    geofencingZone?.geojson?.features?.sort(
      (a, b) =>
        a?.properties?.geofencingZoneCategoryProps?.layerIndexWeight -
        b?.properties?.geofencingZoneCategoryProps?.layerIndexWeight, // todo: update types
    );
  });
}

type Tuple<T> = [T, T];
// generalized TypeScript-version of MapBox Polyline's "flipped": https://github.com/mapbox/polyline/blob/master/src/polyline.js#L118
function flippedTuples(tuples: Array<Tuple<number>>): Array<Tuple<number>> {
  const flipped: Array<Tuple<number>> = [];
  for (let i = 0; i < tuples.length; i++) {
    const tuple = tuples[i];
    flipped.push([tuple[1], tuple[0]]);
  }
  return flipped;
}

// todo: add test for this function
export function decodePolylineEncodedMultiPolygons(
  geofencingZones: PreProcessedGeofencingZones[],
) {
  forAllFeaturesInAllGeofencingZones(geofencingZones, (feature: Feature) => {
    if (!feature?.properties?.polylineEncodedMultiPolygon) return;

    if (!feature.geometry) {
      feature.geometry = {
        type: 'MultiPolygon',
        coordinates: [],
      };
    }

    // init empty array
    feature.geometry.coordinates =
      feature.properties.polylineEncodedMultiPolygon.map(
        (polygon) => new Array(polygon.length),
      );

    // fill in decoded coordinates
    feature.properties.polylineEncodedMultiPolygon.forEach((polygon, i) => {
      polygon.forEach((ring, j) => {
        if (!feature?.geometry?.coordinates) return; // should never happen
        // flip because GeoJson is defined with [lon, lat], while mapbox uses [lat, lon]
        feature.geometry.coordinates[i][j] = flippedTuples(
          polyline.decode(ring, 6),
        );
        // todo: consider "del polygon[j]" here
      });
    });
  });
}

export function addGeofencingZoneCategoryProps(
  geofencingZones: PreProcessedGeofencingZones[],
  geofencingZoneCategoriesProps: GeofencingZoneCategoriesProps,
  vehicleTypeId?: string,
) {
  if (!vehicleTypeId) return;
  forAllFeaturesInAllGeofencingZones(
    geofencingZones,
    (feature, geofencingZonesIndex) => {
      if (geofencingZonesIndex === 0) {
        geofencingZones[geofencingZonesIndex]['renderKey'] =
          geofencingZonesIndex.toString(); // fix type
      }
      // the option to have multiple rules, is to make it allow different rules per vehicle type
      const applicableRules = feature.properties?.rules?.filter((rule) =>
        rule.vehicleTypeIds?.includes(vehicleTypeId),
      );
      // the first applicable rule for the given vehicly type is the decisive one
      const rule = applicableRules?.[0];

      let rideNotAllowed = false,
        rideThroughNotAllowed = false,
        isSlowArea = false;
      //let isStationParking = false

      if (rule) {
        rideNotAllowed = !rule.rideAllowed;
        rideThroughNotAllowed = !rule.rideThroughAllowed;
        isSlowArea =
          rule.maximumSpeedKph !== undefined &&
          rule.maximumSpeedKph !== null &&
          Number(rule.maximumSpeedKph) < 20;
        //isStationParking = !!rule.stationParking
      }

      const {
        Allowed,
        Slow,
        //StationParking,
        NoParking,
        NoEntry,
      } = geofencingZoneCategoriesProps;

      let geofencingZoneCategoryProps: GeofencingZoneCategoryProps<GeofencingZoneCategoryKey> =
        Allowed;

      if (rideThroughNotAllowed) {
        geofencingZoneCategoryProps = NoEntry;
      } else if (rideNotAllowed) {
        geofencingZoneCategoryProps = NoParking;
      } else if (isSlowArea) {
        geofencingZoneCategoryProps = Slow;
      }

      // if (isStationParking) {
      //   geofencingZoneCategoryProps = StationParking;
      // }

      feature.properties = {
        ...feature.properties,
        ...{geofencingZoneCategoryProps},
      };
    },
  );
}

function forAllFeaturesInAllGeofencingZones(
  geofencingZones: PreProcessedGeofencingZones[],
  iteratorFunc: (
    feature: Feature,
    geofencingZoneIndex: number,
    featureIndex: number,
  ) => void,
) {
  for (const [i, geofencingZone] of geofencingZones.entries()) {
    for (const [j, feature] of (
      geofencingZone?.geojson?.features || []
    ).entries()) {
      !!feature && iteratorFunc(feature, i, j);
    }
  }
}
