import MapboxGL from '@rnmapbox/maps';

import {FeatureCollection, GeoJsonProperties, Point, Feature} from 'geojson';

import {usePreProcessedGeofencingZones} from '@atb/components/map';
import {useVehicleQuery} from '@atb/mobility/queries/use-vehicle-query';
import {isBicycle, isScooter} from '@atb/mobility';

type GeofencingZonesProps = {
  selectedFeature: Feature<Point, GeoJsonProperties>;
};

// const hardcodedSelectedFeatureUtilForDev = {
//   tier: {
//     geometry: {
//       coordinates: [10.387516915798187, 63.43202209036642],
//       type: 'Point',
//     },
//     properties: {
//       __typename: 'Vehicle',
//       currentFuelPercent: 14,
//       currentRangeMeters: 8000,
//       id: 'YTI:Vehicle:748dc33e6639282774bc99dbfbbd9b40e66128dc0eb27b7b2f1c34c331f245d7',
//       lat: 63.43202237,
//       lon: 10.38751628,
//       vehicleType: {
//         __typename: 'VehicleType',
//         formFactor: 'SCOOTER',
//         maxRangeMeters: 55000,
//       },
//     },
//     type: 'Feature',
//   },
//   voi: {
//     geometry: {
//       coordinates: [10.384751558303833, 63.42952192552485],
//       type: 'Point',
//     },
//     properties: {
//       __typename: 'Vehicle',
//       currentFuelPercent: 91,
//       currentRangeMeters: 72800,
//       id: 'YVO:Vehicle:f4d753e5-4b6e-464a-99d8-b4fa90cad3f6',
//       lat: 63.429522,
//       lon: 10.384751,
//       vehicleType: {
//         __typename: 'VehicleType',
//         formFactor: 'SCOOTER',
//         maxRangeMeters: 80000,
//       },
//     },
//     type: 'Feature',
//   },
//   ryde: {
//     geometry: {
//       coordinates: [10.402133613824844, 63.43606999929432],
//       type: 'Point',
//     },
//     properties: {
//       __typename: 'Vehicle',
//       currentFuelPercent: 63,
//       currentRangeMeters: 35600,
//       id: 'YRY:Vehicle:cb82590a-5f96-3d0c-9fba-6720db0838ff',
//       lat: 63.43607,
//       lon: 10.402134,
//       vehicleType: {
//         __typename: 'VehicleType',
//         formFactor: 'SCOOTER_STANDING',
//         maxRangeMeters: 56300,
//       },
//     },
//     type: 'Feature',
//   },
// };

export const GeofencingZones = ({selectedFeature}: GeofencingZonesProps) => {
  //selectedFeature = hardcodedSelectedFeatureUtilForDev.voi; // dev util
  const selectedVehicleId =
    isScooter(selectedFeature) || isBicycle(selectedFeature)
      ? selectedFeature.properties.id
      : undefined;

  const {
    data: vehicle,
    isLoading,
    isError,
  } = useVehicleQuery(selectedVehicleId);

  const preProcessedGeofencingZones = usePreProcessedGeofencingZones(vehicle);

  if (
    !selectedVehicleId ||
    isLoading ||
    isError ||
    preProcessedGeofencingZones.length === 0
  ) {
    return <></>;
  }

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
          aboveLayerID="water-point-label"
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
          aboveLayerID="water-point-label"
        />
      </MapboxGL.ShapeSource>
    ),
  );

  return <>{mappedGeofencingZones}</>;
};
