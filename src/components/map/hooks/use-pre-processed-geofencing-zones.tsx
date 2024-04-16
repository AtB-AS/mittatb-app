import {
  PreProcessedGeofencingZones,
  addGeofencingZoneCategoryProps,
  decodePolylineEncodedMultiPolygons,
  sortFeaturesByLayerIndexWeight,
  useGeofencingZoneCategoriesProps,
} from '@atb/components/map';

import voitrondheim from '../voiTrondheimEncoded.json';
import tiertrondheim from '../tierTrondheimEncoded.json';

const geofencingZonesData = {
  voitrondheim,
  tiertrondheim,
};

import {useMemo} from 'react';
import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';

// TODO
// filter by vehicle type id, see rules // half way done
// if many rules for the same vehicle, choose the first one // done
// question: immutability vs performance vs readability? ANSWER: TODO - use immutability
// fix types
// case: several zones at once - gløs -> slow zone + no parking + station parking = allowed?
// order decides atm
// idea: check if both StationParking in NoParking + Allowed in another // probably no
// idea: if more than one allowed zone assume bonus parking? // probably no
// tier has some areas with more than one rule, handle this // done
// system hours?

export const usePreProcessedGeofencingZones = (
  vehicle?: VehicleExtendedFragment,
) => {
  const systemId = vehicle?.system.id;
  const vehicleTypeId = vehicle?.vehicleType.id;

  const geofencingZoneCategoriesProps = useGeofencingZoneCategoriesProps();

  const res = geofencingZonesData[systemId]; // TODO: get geofencingZones from bff

  const geofencingZones = useMemo(() => {
    return (res?.['data']?.['geofencingZones'] ||
      []) as PreProcessedGeofencingZones[];
  }, [res]);

  //filterOutFeaturesNotApplicableForCurrentVehicle(geofencingZones) // todo
  addGeofencingZoneCategoryProps(
    geofencingZones,
    geofencingZoneCategoriesProps,
    vehicleTypeId,
  );
  decodePolylineEncodedMultiPolygons(geofencingZones);
  sortFeaturesByLayerIndexWeight(geofencingZones);

  //forAllFeaturesInAllGeofencingZones(geofencingZones, (feature: Feature) => console.log('feature?.properties?.color', feature?.properties?.color))
  return useMemo(
    () => geofencingZones.filter((gz) => !!gz.geojson), // todo: move filter to a better place?
    [geofencingZones],
  );
};
