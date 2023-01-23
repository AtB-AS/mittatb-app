import {useState} from 'react';
import {GeoJSON} from 'geojson';
import {RegionPayload} from '@react-native-mapbox-gl/maps';
import {Coordinates} from '@atb/utils/coordinates';

export const useRegion = (startingCoordinates: Coordinates) => {
  const [currentCoordinates, setCurrentCoordinates] = useState({
    ...startingCoordinates,
  });
  const [currentZoom, setCurrentZoom] = useState(0);

  const onRegionChange = (
    feature: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ) => {
    const [longitude, latitude] = feature.geometry.coordinates;
    const zoom = feature.properties.zoomLevel;
    setCurrentCoordinates({latitude, longitude});
    setCurrentZoom(zoom);
  };

  return {currentCoordinates, currentZoom, onRegionChange};
};
