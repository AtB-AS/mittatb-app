import {useCallback, useEffect, useRef, useState} from 'react';
import {GeofencingZoneCategoryCode} from '@atb/components/map';

export function useGeofencingZoneExplanation(hasSelectedFeature: boolean) {
  const [
    geofencingZoneCategoryCodeToExplain,
    setGeofencingZoneCategoryCodeToExplain,
  ] = useState<GeofencingZoneCategoryCode>();
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const resetGeofencingZoneExplanation = () => {
    timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
    setGeofencingZoneCategoryCodeToExplain(undefined);
  };

  const geofencingZoneOnPress = useCallback(
    (geofencingZoneCategoryCode?: GeofencingZoneCategoryCode) => {
      if (!geofencingZoneCategoryCode) {
        resetGeofencingZoneExplanation();
        return;
      }

      setGeofencingZoneCategoryCodeToExplain(geofencingZoneCategoryCode);

      timeoutIdRef.current && clearTimeout(timeoutIdRef.current);

      timeoutIdRef.current = setTimeout(
        () => setGeofencingZoneCategoryCodeToExplain(undefined),
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
    geofencingZoneCategoryCodeToExplain,
    geofencingZoneOnPress,
    resetGeofencingZoneExplanation,
  };
}
