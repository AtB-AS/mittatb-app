import {CameraFocusModeType, MapSelectionActionType} from '../types';

import {useEffect, useState} from 'react';
import {mapPositionToCoordinates} from '../utils';

export const useDecideCameraFocusMode = (
  mapSelectionAction: MapSelectionActionType | undefined,
) => {
  const [cameraFocusMode, setCameraFocusMode] = useState<CameraFocusModeType>();

  useEffect(() => {
    (async function () {
      if (!mapSelectionAction) {
        setCameraFocusMode(undefined);
        return;
      }

      if (mapSelectionAction.source === 'my-position') {
        setCameraFocusMode({
          mode: 'my-position',
          coordinates: mapSelectionAction.coords,
        });
        return;
      }

      if (mapSelectionAction.source === 'filters-button') {
        setCameraFocusMode(undefined);
        return;
      }

      if (mapSelectionAction.source === 'bonus-program-button') {
        setCameraFocusMode(undefined);
        return;
      }

      if (mapSelectionAction.source === 'external-map-button') {
        setCameraFocusMode(undefined);
        return;
      }

      if (mapSelectionAction.source === 'cluster-click') {
        setCameraFocusMode(undefined);
        return;
      }

      if (mapSelectionAction.source === 'qr-scan') {
        setCameraFocusMode(undefined);
        return;
      }

      setCameraFocusMode({
        mode: 'coordinates',
        coordinates: mapPositionToCoordinates(
          mapSelectionAction.feature.geometry.coordinates,
        ),
      });
    })();
  }, [mapSelectionAction]);
  return cameraFocusMode;
};
