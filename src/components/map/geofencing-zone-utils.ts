import {
  GeofencingZoneCategoriesProps,
  GeofencingZoneCategoryKey,
  GeofencingZoneCategoryProps,
  PreProcessedGeofencingZones,
} from '@atb/components/map';
import {isDefined} from '@atb/utils/presence';
import sortBy from 'lodash.sortby';
import polyline from '@mapbox/polyline';

export function sortFeaturesByLayerIndexWeight(
  geofencingZones: PreProcessedGeofencingZones[],
): PreProcessedGeofencingZones[] {
  return geofencingZones.map((geofencingZone) => {
    const sortedFeatures = sortBy(
      geofencingZone?.geojson?.features,
      (feature) =>
        feature?.properties?.geofencingZoneCategoryProps?.layerIndexWeight,
    );

    return {
      ...geofencingZone,
      geojson: {
        ...geofencingZone.geojson,
        features: sortedFeatures,
      },
    };
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
): PreProcessedGeofencingZones[] {
  return geofencingZones
    ?.map((geofencingZone) => {
      const features = geofencingZone?.geojson?.features
        ?.map((feature) => {
          const coordinates = feature.properties?.polylineEncodedMultiPolygon
            ?.map((polygon) =>
              polygon // the flip is because GeoJson is defined with [lon, lat], while mapbox uses [lat, lon])
                .map((ring) => flippedTuples(polyline.decode(ring, 6)))
                .filter(isDefined),
            )
            .filter(isDefined);

          const geometry = {
            ...feature.geometry,
            coordinates,
          };
          return {...feature, geometry};
        })
        .filter(isDefined);
      const geojson = {...geofencingZone.geojson, features};
      return {...geofencingZone, geojson};
    })
    .filter(isDefined);
}

export function addGeofencingZoneCategoryProps(
  geofencingZones: PreProcessedGeofencingZones[],
  geofencingZoneCategoriesProps: GeofencingZoneCategoriesProps,
  vehicleTypeId?: string,
) {
  if (!vehicleTypeId) return geofencingZones;

  const geofencingZonesWithCategoryProps = geofencingZones.map(
    (geofencingZone, geofencingZonesIndex) => {
      const preProcessedFeatures = (
        geofencingZone?.geojson?.features || []
      ).map((feature) => {
        if (geofencingZonesIndex === 0) {
          geofencingZones[geofencingZonesIndex]['renderKey'] =
            geofencingZonesIndex.toString();
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

        const preProcessedProperties = {
          ...feature.properties,
          ...{geofencingZoneCategoryProps},
        };

        return {
          ...feature,
          properties: preProcessedProperties,
        };
      });

      const preProcessedGeojson = {
        ...geofencingZone.geojson,
        features: preProcessedFeatures,
      };

      return {...geofencingZone, geojson: preProcessedGeojson};
    },
  );

  return geofencingZonesWithCategoryProps;
}
