import {RefObject, useState} from 'react';
import {MapRegion} from '@atb/components/map';
import MapboxGL, {MapState} from '@rnmapbox/maps';
import isEqual from 'lodash.isequal';

export const useMapRegion = (mapViewRef: RefObject<MapboxGL.MapView>) => {
  const [mapRegion, setMapRegion] = useState<MapRegion>();

  const onDidFinishLoadingMap = async () => {
    const visibleBounds = await mapViewRef.current?.getVisibleBounds();
    const zoomLevel = await mapViewRef.current?.getZoom();
    const center = await mapViewRef.current?.getCenter();

    if (!visibleBounds || !zoomLevel || !center) return;
    setMapRegion({visibleBounds, zoomLevel, center});
  };

  /**
   * OnMapIdle fires more often than expected, because of that we check if the
   * map region is changed before updating its state.
   *
   * There is a slight performance overhead by deep comparing previous and new
   * map regions on each on map idle, but since we have control over the size of
   * the objects it should be ok. The risk of firing effects that uses the map
   * region too often is greater than the risk introduced by the performance
   * overhead.
   */
  const onMapIdle = (state: MapState) => {
    const newMapRegion: MapRegion = {
      visibleBounds: [state.properties.bounds.ne, state.properties.bounds.sw],
      zoomLevel: state.properties.zoom,
      center: state.properties.center,
    };
    setMapRegion((prevMapRegion) =>
      isEqual(prevMapRegion, newMapRegion) ? prevMapRegion : newMapRegion,
    );
  };

  return {mapRegion, onDidFinishLoadingMap, onMapIdle};
};
