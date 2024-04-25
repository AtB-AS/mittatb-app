import {
  GeofencingZoneCategoriesProps,
  GeofencingZoneCategoryKey,
  GeofencingZoneCategoryProps,
  PreProcessedGeofencingZones,
} from '@atb/components/map';
import sortBy from 'lodash.sortby';
import {toGeoJSON} from '@mapbox/polyline';
import {GeofencingZones} from '@atb/api/types/generated/mobility-types_v2';

export function filterOutFeaturesNotApplicableForCurrentVehicle(
  geofencingZones?: GeofencingZones[],
  vehicleTypeId?: string,
): GeofencingZones[] {
  if (!vehicleTypeId || !geofencingZones) {
    return [];
  }
  return geofencingZones
    ?.filter((gz) => !!gz.geojson) // only geofencingZones with geojson data are applicable
    .map((geofencingZone) => {
      const filteredFeatures = geofencingZone?.geojson?.features?.filter(
        (feature) => {
          const applicableRules = feature.properties?.rules?.filter((rule) =>
            rule.vehicleTypeIds?.includes(vehicleTypeId),
          );
          return (applicableRules?.length || 0) > 0;
        },
      );

      return {
        ...geofencingZone,
        geojson: {
          ...geofencingZone.geojson,
          features: filteredFeatures,
        },
      };
    });
}

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

// todo: add test for this function
/**
 * For lowering waiting times and to reduce network traffic, the coordinates data is fetched in an encoded format
 * This function decodes the data from polylineEncodedMultiPolygon, and adds it to coordinates in the geojson object
 *
 * @param geofencingZones geojson with polylineEncodedMultiPolygon, but without coordinates
 * @returns geofencingZones geojson with coordinates
 */
export function decodePolylineEncodedMultiPolygons(
  geofencingZones: PreProcessedGeofencingZones[],
): PreProcessedGeofencingZones[] {
  return geofencingZones?.map((geofencingZone) => {
    const features = geofencingZone?.geojson?.features?.map((feature) => {
      const coordinates = feature.properties?.polylineEncodedMultiPolygon?.map(
        (polygon) => polygon.map((ring) => toGeoJSON(ring, 6).coordinates),
      );

      const geometry = {
        ...feature.geometry,
        coordinates,
      };
      return {...feature, geometry};
    });
    const geojson = {...geofencingZone.geojson, features};
    return {...geofencingZone, geojson};
  });
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

      return {
        ...geofencingZone,
        geojson: {
          ...geofencingZone.geojson,
          features: preProcessedFeatures,
        },
      };
    },
  );

  return geofencingZonesWithCategoryProps;
}
