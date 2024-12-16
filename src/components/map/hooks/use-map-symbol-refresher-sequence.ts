import {useTheme} from '@atb/theme';
import {useInterval} from '@atb/utils/use-interval';

import {useEffect, useState} from 'react';

const REFRESHING_DURATION_MS = 1500; // Should be long enough for slow phones to be ready as well
const REFRESH_INTERVAL_MS = 250;

/**
 * Custom hook to refresh map symbols by toggling icon names.
 *
 * When `startMapSymbolRefresherSequence` is invoked, the hook will toggle
 * `useToggledIconName` at intervals defined by `REFRESH_INTERVAL_MS` for a total
 * duration of `REFRESHING_DURATION_MS`. This forces a re-render of the icons,
 * addressing a Mapbox issue where icons loaded via `<MapboxGL.Images />`
 * do not reliably refresh.
 *
 * @returns {Object} An object containing:
 *  - `startMapSymbolRefresherSequence`: Function to initiate the refresh sequence.
 *  - `useToggledIconName`: Boolean indicating the current toggle state of the icon name.
 */
export const useMapSymbolRefresherSequence = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const {themeName} = useTheme();

  const startMapSymbolRefresherSequence = () => {
    setRefreshCount(0);
    setHasStarted(true);
  };

  useEffect(() => {
    // if initially activated, also refresh when light/dark mode changes
    hasStarted && startMapSymbolRefresherSequence();
  }, [themeName, hasStarted]);

  const [useToggledIconName, setUseToggledIconName] = useState(false);

  const refreshIntervalIsDisabled =
    !hasStarted || refreshCount >= REFRESHING_DURATION_MS / REFRESH_INTERVAL_MS;

  useInterval(
    () => {
      setUseToggledIconName((useToggledIconName) => !useToggledIconName);
      setRefreshCount((refreshCount) => refreshCount + 1);
    },
    [setUseToggledIconName, setRefreshCount],
    REFRESH_INTERVAL_MS,
    refreshIntervalIsDisabled,
    false,
  );

  return {
    startMapSymbolRefresherSequence,
    useToggledIconName,
  };
};
