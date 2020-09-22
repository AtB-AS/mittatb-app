import React, {useRef, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Leg} from '@entur/sdk';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MapIcon} from '../../../assets/svg/map';
import {getMapBounds, legsToMapLines, pointOf} from './utils';
import MapRoute from './MapRoute';
import MapLabel from './MapLabel';
import colors from '../../../theme/colors';
import {MapViewConfig} from '../../../components/map/MapConfig';

export type MapProps = {
  legs: Leg[];
  onExpand(): void;
};

export const CompactMap: React.FC<MapProps> = ({legs, onExpand}) => {
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const [snapshot, setSnapshot] = useState<string | undefined>();
  const [inTransition, setInTransition] = useState<boolean>(true);

  const features = legsToMapLines(legs);
  const startPoint = pointOf(legs[0].fromPlace);
  const endPoint = pointOf(legs[legs.length - 1].toPlace);
  const bounds = getMapBounds(features, 40);

  function finishedLoading() {
    setTimeout(async () => {
      const snap = await mapViewRef.current?.takeSnap();
      setSnapshot(snap);
      setTimeout(() => setInTransition(false), 200);
    }, 1000);
  }

  const renderMap = !snapshot || inTransition;

  return (
    <View style={styles.mapView}>
      {renderMap && (
        <MapboxGL.MapView
          ref={mapViewRef}
          style={styles.map}
          scrollEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          onDidFinishRenderingMapFully={finishedLoading}
          {...MapViewConfig}
        >
          <MapboxGL.Camera
            ref={mapCameraRef}
            bounds={bounds}
            animationDuration={0}
          />
          <MapRoute lines={features}></MapRoute>
          <MapLabel point={endPoint} id={'end'} text="Slutt"></MapLabel>
          <MapLabel point={startPoint} id={'start'} text="Start"></MapLabel>
        </MapboxGL.MapView>
      )}
      {!!snapshot && <Image style={styles.map} source={{uri: snapshot}} />}
      <TouchableOpacity style={styles.toggler} onPress={onExpand}>
        <Text style={styles.toggleText}>Utvid kart</Text>
        <MapIcon style={styles.toggleIcon} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  mapView: {flex: 1, height: 96, justifyContent: 'flex-end'},
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  toggler: {
    alignSelf: 'flex-end',
    right: 12,
    bottom: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.general.black,
    textShadowColor: colors.general.white,
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 1,
  },
  toggleIcon: {
    marginLeft: 4,
  },
});

export default CompactMap;
