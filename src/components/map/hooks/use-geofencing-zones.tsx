import res from '../voiTrondheimEncoded.json';
import polyline from '@mapbox/polyline';

export const useGeofencingZones = () => {
  const geofencingZones = res['data']['geofencingZones'];
  geofencingZones[0].geojson.features =
    geofencingZones[0].geojson.features.filter((feature) => {
      // Assuming rules is an array and we're interested in any rule where rideAllowed is false
      const rideNotAllowed = feature.properties.rules.some(
        (rule) => !rule.rideAllowed,
      );
      const rideThroughNotAllowed = feature.properties.rules.some(
        (rule) => !rule.rideThroughAllowed,
      );

      const isSlowArea = feature.properties.rules.some(
        (rule) =>
          Number(rule.maximumSpeedKph) < 20 ||
          rule.maximumSpeedKph === undefined, // hmm, hardcoded, bad
      );

      // default: standard for rideNotAllowed
      let color = '#e62b14';
      let opacity = 0.3;
      if (rideThroughNotAllowed) {
        color = '#685454';
        opacity = 0.75;
      } else if (isSlowArea) {
        color = '#eebe20';
      }
      // Add a simplified top-level property for easy access
      feature.properties.color = color;
      feature.properties.opacity = opacity;
      return !!rideNotAllowed || isSlowArea || !!rideThroughNotAllowed;
    });
  // console.log('geofencingZones', geofencingZones);
  for (const geofencingZone of geofencingZones) {
    for (const feature of geofencingZone.geojson.features) {
      feature.geometry.coordinates.forEach((coordinateArrays, i) => {
        coordinateArrays.forEach((coordinateArray, j) => {
          if (typeof coordinateArray === 'string') {
            //console.log('coordinateArray', coordinateArray);
            feature.geometry.coordinates[i][j] =
              polyline.decode(coordinateArray);
          }
        });
      });
    }
  }
  return geofencingZones;
};
