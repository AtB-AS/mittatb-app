import {
  Feature,
  GeofencingZones,
} from '@atb/api/types/generated/mobility-types_v2';

import res from '../voiTrondheimEncoded.json';
//import res from '../tierTrondheimEncoded.json';

import polyline from '@mapbox/polyline';
import {useMemo} from 'react';
//import {useTheme} from '@atb/theme/ThemeContext';

// TODO
// filter by vehicle type id, see rules
// if many rules for the same vehicle, choose the first one
// question: immutability vs performance vs readability?
// fix types
// case: several zones at ones - gløs -> slow zone + no parking + station parking = allowed?
// order decides atm
// idea: check if both StationParking in NoParking + Allowed in another
// idea: if more than one allowed zone assume bonus parking?
// tier has some areas with more than one rule, handle this
// system hours?

export enum GeofencingZoneCategory {
  Allowed = 'Allowed',
  Slow = 'Slow',
  StationParking = 'StationParking',
  NoParking = 'NoParking',
  NoEntry = 'NoEntry',
}

type GeofencingZoneCategoryKey = keyof typeof GeofencingZoneCategory;

type GeofencingZoneCategoryProps<GZCKey extends GeofencingZoneCategoryKey> = {
  name: GZCKey;
  color: string;
  fillOpacity: number;
  strokeOpacity: number;
  layerIndexWeight: number;
};

type GeofencingZoneCategoriesProps = {
  [GZCKey in GeofencingZoneCategoryKey]: GeofencingZoneCategoryProps<GZCKey>;
};

const useGeofencingZoneCategoriesProps = () => {
  // const {theme, themeName} = useTheme();
  // console.log('themeName', themeName);
  // console.log('JSON.stringify(theme)', JSON.stringify(theme));
  // todo: use base colors + prepare for light + dark mode?
  const geofencingZoneCategoriesProps: GeofencingZoneCategoriesProps = {
    Allowed: {
      name: 'Allowed',
      color: '#007C92', // blue_500
      fillOpacity: 0.075,
      strokeOpacity: 0.5,
      layerIndexWeight: 1,
    },
    Slow: {
      name: 'Slow',
      color: '#F0E973', // yellow_100
      fillOpacity: 0.6,
      strokeOpacity: 0.8,
      layerIndexWeight: 2,
    },
    StationParking: {
      name: 'StationParking',
      color: '#C75B12', // orange_500
      fillOpacity: 0.5,
      strokeOpacity: 0.7,
      layerIndexWeight: 1,
    },
    NoParking: {
      name: 'NoParking',
      color: '#C76B89', // red_400
      fillOpacity: 0.5,
      strokeOpacity: 0.7,
      layerIndexWeight: 3,
    },
    NoEntry: {
      name: 'NoEntry',
      color: '#380616', // red_900
      fillOpacity: 0.55,
      strokeOpacity: 0.75,
      layerIndexWeight: 5,
    },
  };
  return geofencingZoneCategoriesProps;
};

export const useGeofencingZones = () => {
  const geofencingZoneCategoriesProps = useGeofencingZoneCategoriesProps();

  const geofencingZones = (res['data']['geofencingZones'] ||
    []) as GeofencingZones[]; // todo: fix type

  //filterOutFeaturesNotApplicableForCurrentVehicle(geofencingZones) // todo
  addGeofencingZoneCategoryProps(
    geofencingZones,
    geofencingZoneCategoriesProps,
  );
  decodePolylineEncodedMultiPolygons(geofencingZones);
  sortFeaturesByLayerIndexWeight(geofencingZones);

  //forAllFeaturesInAllGeofencingZones(geofencingZones, (feature: Feature) => console.log('feature?.properties?.color', feature?.properties?.color))
  return useMemo(() => geofencingZones, [geofencingZones]);
};

function sortFeaturesByLayerIndexWeight(geofencingZones: GeofencingZones[]) {
  geofencingZones.forEach((geofencingZone) => {
    geofencingZone?.geojson?.features?.sort(
      (a, b) =>
        a?.properties?.geofencingZoneCategoryProps?.layerIndexWeight -
        b?.properties?.geofencingZoneCategoryProps?.layerIndexWeight, // todo: update types
    );
  });
}

// todo: move to pure utils
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

function forAllFeaturesInAllGeofencingZones(
  geofencingZones: GeofencingZones[],
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

// todo: add test for this function
function decodePolylineEncodedMultiPolygons(
  geofencingZones: GeofencingZones[],
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
        feature.geometry.coordinates[i][j] = flippedTuples(
          polyline.decode(ring, 6),
        );
        // todo: consider "del polygon[j]" here
      });
    });
  });
}

function addGeofencingZoneCategoryProps(
  geofencingZones: GeofencingZones[],
  geofencingZoneCategoriesProps: GeofencingZoneCategoriesProps,
) {
  forAllFeaturesInAllGeofencingZones(
    geofencingZones,
    (feature, geofencingZonesIndex) => {
      if (geofencingZonesIndex === 0) {
        geofencingZones[geofencingZonesIndex]['renderKey'] =
          geofencingZonesIndex.toString(); // fix type
      }
      const rules = feature.properties?.rules || [];

      if (rules.length > 1) {
        console.log('EHIOAGHOIAEGIOANEOGOIAE');
      }

      const rideNotAllowed = rules.some((rule) => !rule.rideAllowed);

      const rideThroughNotAllowed = rules.some(
        (rule) => !rule.rideThroughAllowed,
      );

      const isSlowArea = rules.some(
        (rule) =>
          rule.maximumSpeedKph !== undefined &&
          rule.maximumSpeedKph !== null &&
          Number(rule.maximumSpeedKph) < 20,
      );

      //const isStationParking = rules.some((rule) => !!rule.stationParking);

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
