import {useCallback, useEffect, useRef, useState} from 'react';
import {
  GeofencingZoneCategoryKey,
  GeofencingZoneCategoryProps,
} from '@atb/components/map';

export function useGeofencingZoneExplanation(hasSelectedFeature: boolean) {
  const [
    geofencingZoneCategoryPropsToExplain,
    setGeofencingZoneCategoryPropsToExplain,
  ] = useState<GeofencingZoneCategoryProps<GeofencingZoneCategoryKey>>();
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const resetGeofencingZoneExplanation = () => {
    timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
    setGeofencingZoneCategoryPropsToExplain(undefined);
  };

  const geofencingZoneOnPress = useCallback(
    (
      geofencingZoneCategoryProps?: GeofencingZoneCategoryProps<GeofencingZoneCategoryKey>,
    ) => {
      if (!geofencingZoneCategoryProps) {
        resetGeofencingZoneExplanation();
        return;
      }

      setGeofencingZoneCategoryPropsToExplain(geofencingZoneCategoryProps);

      timeoutIdRef.current && clearTimeout(timeoutIdRef.current);

      timeoutIdRef.current = setTimeout(
        () => setGeofencingZoneCategoryPropsToExplain(undefined),
        3000,
      );
    },
    [],
  );

  useEffect(() => {
    // reset state when no feature is selected
    if (!hasSelectedFeature) {
      resetGeofencingZoneExplanation();
    }
  }, [hasSelectedFeature]);

  return {
    geofencingZoneCategoryPropsToExplain,
    geofencingZoneOnPress,
    resetGeofencingZoneExplanation,
  };
}
