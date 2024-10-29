import {useStopPlacePlugin} from './stop-place-plugin/use-stop-place-plugin';
import {Feature, Point} from 'geojson';
import {useElScootersPlugin} from '@atb/components/map_v2/plugins/el-scooter-plugin/use-el-scooters-plugin.tsx';
import {MapRegion} from '@atb/components/map_v2';
import {MapPluginsSharedState} from '@atb/components/map_v2/plugins/types.ts';
import {useState} from 'react';
import {useGeofencingZonesPlugin} from '@atb/components/map_v2/plugins/geofencing-zones-plugin/use-geofencing-zones-plugin.tsx';

export const usePlugins = (region?: MapRegion) => {
  const [sharedState, setSharedState] = useState<MapPluginsSharedState>({
    selectedEntityId: undefined,
  });
  const pluginProps = {region, sharedState, setSharedState};
  const {handlePress: handleStopPlaceClick} = useStopPlacePlugin(pluginProps);
  const {handlePress: handleElScooterClick, renderedFeature: elScooterFeature} =
    useElScootersPlugin(pluginProps);
  const {
    handlePress: _handleGeofencingZonesClick,
    renderedFeature: geofencingZoneFeature,
  } = useGeofencingZonesPlugin(pluginProps);

  const clickHandlers = [handleStopPlaceClick, handleElScooterClick];

  const handleClick = (features: Feature<Point>[]) => {
    for (const handle of clickHandlers) {
      const cont = handle(features);
      if (!cont) break;
    }
    return true;
  };

  return {
    handleClick,
    renderedFeatures: (
      <>
        {elScooterFeature}
        {geofencingZoneFeature}
      </>
    ),
  };
};
