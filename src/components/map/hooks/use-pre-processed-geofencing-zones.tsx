import {
  PreProcessedGeofencingZones,
  addGeofencingZoneCategoryProps,
  decodePolylineEncodedMultiPolygons,
  sortFeaturesByLayerIndexWeight,
  useGeofencingZoneCategoriesProps,
} from '@atb/components/map';

import res from '../voiTrondheimEncoded.json';
//import res from '../tierTrondheimEncoded.json';

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

export const usePreProcessedGeofencingZones = () => {
  const geofencingZoneCategoriesProps = useGeofencingZoneCategoriesProps();

  const geofencingZones = useMemo(() => {
    return (res['data']['geofencingZones'] ||
      []) as PreProcessedGeofencingZones[];
  }, []);

  //filterOutFeaturesNotApplicableForCurrentVehicle(geofencingZones) // todo
  addGeofencingZoneCategoryProps(
    geofencingZones,
    geofencingZoneCategoriesProps,
  );
  decodePolylineEncodedMultiPolygons(geofencingZones);
  sortFeaturesByLayerIndexWeight(geofencingZones);

  //forAllFeaturesInAllGeofencingZones(geofencingZones, (feature: Feature) => console.log('feature?.properties?.color', feature?.properties?.color))
  return useMemo(
    () => geofencingZones.filter((gz) => !!gz.geojson), // todo: move filter to a better place?
    [geofencingZones],
  );
};
