import {
  GeofencingZoneCustomProps,
  PreProcessedGeofencingZones,
} from '@atb/modules/map';
import sortBy from 'lodash.sortby';
import {toGeoJSON} from '@mapbox/polyline';
import {
  Feature,
  GeofencingZoneRule,
  GeofencingZones,
} from '@atb/api/types/generated/mobility-types_v2';
import {GeofencingZoneStyles} from '@atb-as/theme';
import {ContrastColor} from '@atb/theme/colors';
import polylabel from 'polylabel';
import {PointFeature, PointFeatureCollection} from './types';

function getApplicableGeofencingZoneRules(
  feature: Feature,
  vehicleTypeId: string,
): GeofencingZoneRule[] {
  return (
    feature.properties?.rules?.filter(
      (rule) =>
        rule.vehicleTypeIds?.includes(vehicleTypeId) || !rule.vehicleTypeIds, // if vehicleTypeIds is not defined, the rule applies to all vehicles
    ) || []
  );
}

export function filterOutFeaturesNotApplicableForCurrentVehicle(
  geofencingZones?: GeofencingZones[] | null,
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
          const applicableRules = getApplicableGeofencingZoneRules(
            feature,
            vehicleTypeId,
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
        feature?.properties?.geofencingZoneCustomProps?.layerIndexWeight,
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

export function getIconFeatureCollections(
  geofencingZones: GeofencingZones[],
): PointFeatureCollection[] {
  return geofencingZones?.map((geofencingZone, geofencingZoneIndex) => {
    const iconFeatures: PointFeature[] = [];
    geofencingZone?.geojson?.features?.forEach((feature) => {
      feature.geometry?.coordinates?.forEach((polygon) => {
        if (isPolygonLarge(polygon)) {
          // No icon for large polygons, long processing time and not useful
          return;
        }
        if (polygon[0].length <= 5) {
          const centerCoordinates = calculateCenterOfSimplePolygon(polygon[0]);
          if (feature.properties) {
            iconFeatures.push({
              type: 'Feature',
              properties: feature.properties,
              geometry: {
                type: 'Point',
                coordinates: centerCoordinates,
              },
            });
          }

          return;
        } else {
          const iconCoordinate = polylabel(polygon, 0.0001);
          if (iconCoordinate && feature.properties) {
            iconFeatures.push({
              type: 'Feature',
              properties: feature.properties,
              geometry: {
                type: 'Point',
                coordinates: iconCoordinate,
              },
            });
          }
        }
      });
    });

    return {
      type: 'FeatureCollection',
      features: iconFeatures,
      renderKey: geofencingZoneIndex.toString(),
    };
  });
}

function calculateCenterOfSimplePolygon(exteriorRing: number[][]) {
  exteriorRing = exteriorRing.slice(0, -1); // Remove duplicate closing coordinate as it matches the first

  const centerLon =
    exteriorRing.reduce((sum, coord) => sum + coord[0], 0) /
    exteriorRing.length;
  const centerLat =
    exteriorRing.reduce((sum, coord) => sum + coord[1], 0) /
    exteriorRing.length;
  return [centerLon, centerLat];
}

function boundingBox(exteriorRing: number[][]) {
  let minLon = Infinity,
    minLat = Infinity;
  let maxLon = -Infinity,
    maxLat = -Infinity;

  for (const [lon, lat] of exteriorRing) {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  return {
    deltaWidth: maxLon - minLon,
    deltaHeight: maxLat - minLat,
  };
}

function isPolygonLarge(polygon: number[][][]): boolean {
  const {deltaWidth, deltaHeight} = boundingBox(polygon[0]);
  return deltaWidth > 1 || deltaHeight > 1;
}

export function addGeofencingZoneCustomProps(
  geofencingZones: PreProcessedGeofencingZones[],
  geofencingZoneStyles: GeofencingZoneStyles<ContrastColor>,
  vehicleTypeId?: string,
) {
  if (!vehicleTypeId) return geofencingZones;

  const geofencingZonesWithCustomProps = geofencingZones.map(
    (geofencingZone, geofencingZonesIndex) => {
      const preProcessedFeatures = (
        geofencingZone?.geojson?.features || []
      ).map((feature) => {
        const applicableRules = getApplicableGeofencingZoneRules(
          feature,
          vehicleTypeId,
        );
        // the first applicable rule for the given vehicle type is the decisive one
        const rule = applicableRules?.[0];

        let rideNotAllowed = false,
          rideThroughNotAllowed = false,
          isSlowArea = false,
          isStationParking = false;

        if (rule) {
          rideNotAllowed = !rule.rideAllowed;
          rideThroughNotAllowed = !rule.rideThroughAllowed;
          isSlowArea =
            rule.maximumSpeedKph !== undefined &&
            rule.maximumSpeedKph !== null &&
            Number(rule.maximumSpeedKph) < 20;
          isStationParking = !!rule.stationParking;
        }

        const {allowed, slow, noParking, noEntry} = geofencingZoneStyles;

        let geofencingZoneCustomProps: GeofencingZoneCustomProps = {
          ...allowed,
          code: 'allowed',
        };

        if (rideThroughNotAllowed) {
          geofencingZoneCustomProps = {...noEntry, code: 'noEntry'};
        } else if (rideNotAllowed) {
          geofencingZoneCustomProps = {...noParking, code: 'noParking'};
        } else if (isSlowArea) {
          geofencingZoneCustomProps = {...slow, code: 'slow'};
        }
        geofencingZoneCustomProps.isStationParking = isStationParking;

        const preProcessedProperties = {
          ...feature.properties,
          geofencingZoneCustomProps,
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
        renderKey: geofencingZonesIndex.toString(),
      };
    },
  );

  return geofencingZonesWithCustomProps;
}
