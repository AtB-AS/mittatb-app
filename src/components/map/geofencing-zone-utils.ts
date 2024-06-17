import {
  GeofencingZoneCustomProps,
  PreProcessedGeofencingZones,
} from '@atb/components/map';
import sortBy from 'lodash.sortby';
import {toGeoJSON} from '@mapbox/polyline';
import {
  Feature,
  GeofencingZoneRule,
  GeofencingZones,
} from '@atb/api/types/generated/mobility-types_v2';
import {GeofencingZoneStyles} from '@atb-as/theme';

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

export function addGeofencingZoneCustomProps(
  geofencingZones: PreProcessedGeofencingZones[],
  geofencingZoneStyles: GeofencingZoneStyles,
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

        const {Allowed, Slow, NoParking, NoEntry} = geofencingZoneStyles;

        let geofencingZoneCustomProps: GeofencingZoneCustomProps = {
          ...Allowed,
          code: 'Allowed',
        };

        if (rideThroughNotAllowed) {
          geofencingZoneCustomProps = {...NoEntry, code: 'NoEntry'};
        } else if (rideNotAllowed) {
          geofencingZoneCustomProps = {...NoParking, code: 'NoParking'};
        } else if (isSlowArea) {
          geofencingZoneCustomProps = {...Slow, code: 'Slow'};
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
