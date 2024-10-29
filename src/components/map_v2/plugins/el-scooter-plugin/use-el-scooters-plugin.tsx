import {isScooter, ScooterSheet, useVehicles} from '@atb/mobility';
import {Scooters} from '@atb/components/map/components/mobility/Scooters.tsx';
import React, {useEffect} from 'react';
import {Feature, Point} from 'geojson';
import {MapPluginType} from '@atb/components/map_v2/plugins/types.ts';
import {useBottomSheet} from '@atb/components/bottom-sheet';

export const useElScootersPlugin: MapPluginType = ({
  region,
  setSharedState,
}) => {
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const vehicles = useVehicles({SCOOTER: {showAll: true, operators: []}});
  const elScooterFeatures = vehicles?.vehicles.scooters;
  const updateRegion = vehicles?.updateRegion;

  useEffect(() => {
    if (region) updateRegion?.(region);
  }, [region, updateRegion]);

  return {
    handlePress: (features: Feature<Point>[]) => {
      const scooterFeature = features.find(isScooter);
      if (scooterFeature) {
        openBottomSheet(() => {
          return (
            <ScooterSheet
              vehicleId={scooterFeature.properties.id}
              onClose={() => {
                setSharedState({selectedEntityId: undefined});
                closeBottomSheet();
              }}
              onReportParkingViolation={() => {}}
            />
          );
        }, false);
        setSharedState({selectedEntityId: scooterFeature.properties.id});
        return true;
      }
      return false;
    },
    renderedFeature: elScooterFeatures ? (
      <Scooters scooters={elScooterFeatures} onClusterClick={() => {}} />
    ) : undefined,
  };
};
