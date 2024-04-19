import {useCallback, useRef, useState} from 'react';
import {
  GeofencingZoneCategoryCode,
  GeofencingZoneCategoryProps,
} from '@atb/components/map';

export function useGeofencingZoneExplanation() {
  const [
    geofencingZoneCategoryCodeToExplain,
    setGeofencingZoneCategoryCodeToExplain,
  ] = useState<GeofencingZoneCategoryCode>();
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const geofencingZoneOnPress = useCallback(
    (
      geofencingZoneCategoryProps?: GeofencingZoneCategoryProps<GeofencingZoneCategoryCode>,
    ) => {
      if (!geofencingZoneCategoryProps) return;

      geofencingZoneCategoryProps?.code &&
        setGeofencingZoneCategoryCodeToExplain(
          geofencingZoneCategoryProps.code,
        );

      timeoutIdRef.current && clearTimeout(timeoutIdRef.current);

      timeoutIdRef.current = setTimeout(
        () => setGeofencingZoneCategoryCodeToExplain(undefined),
        3000,
      );
    },
    [],
  );
  return {
    geofencingZoneCategoryCodeToExplain,
    geofencingZoneOnPress,
  };
}
