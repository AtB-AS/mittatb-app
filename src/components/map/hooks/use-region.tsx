import {RefObject, useEffect, useState} from 'react';
import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {GeoJSON} from 'geojson';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';

export type MapRegion = {
  lat: number;
  lon: number;
  zoom: number;
};

export const useRegion = (startingCoordinates: Coordinates) => {
  // const [region, setRegion] = useState<MapRegion>();
  const [region, setRegion] = useState<MapRegion>({
    lat: startingCoordinates.latitude,
    lon: startingCoordinates.longitude,
    zoom: 14,
  });

  useEffect(() => {
    setRegion({
      lat: startingCoordinates.latitude,
      lon: startingCoordinates.longitude,
      zoom: 14,
    });
  }, []);

  // useEffect(() => {
  //   if (!current) return;
  //   console.log('Initial effect');
  //   Promise.all([current.getCenter(), current.getZoom()]).then(
  //     ([center, zoom]) =>
  //       setRegion({
  //         lat: center ? center[0] : 0,
  //         lon: center ? center[1] : 0,
  //         zoom: zoom ?? 0,
  //       }),
  //   );
  // }, [current]);
  const onRegionChange = (
    feature: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ) => {
    const [lat, lon] = feature.geometry.coordinates;
    const zoom = feature.properties.zoomLevel;
    let region = {lat, lon, zoom};
    console.log('Region changed to ', region);
    setRegion(region);
  };

  return {region, onRegionChange};
};
