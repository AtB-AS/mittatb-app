import {Coordinates} from '@atb/utils/coordinates';
import MapboxGL from '@rnmapbox/maps';
import {
  MapCameraConfig,
  MapViewConfig,
  SelectionPin,
} from '@atb/components/map';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useRef} from 'react';

type Props = {
  userPosition: Coordinates | undefined;
  style?: StyleProp<ViewStyle>;
};
export const UserPositionMap = ({userPosition, style}: Props) => {
  const cameraRef = useRef<MapboxGL.Camera>(null);

  return (
    <View style={[{flex: 1}, style]}>
      {userPosition && (
        <MapboxGL.MapView
          {...MapViewConfig}
          compassEnabled={false}
          zoomEnabled={false}
          scrollEnabled={false}
          rotateEnabled={false}
          style={{flex: 1}}
        >
          <MapboxGL.Camera
            {...MapCameraConfig}
            defaultSettings={{
              centerCoordinate: [userPosition.longitude, userPosition.latitude],
              zoomLevel: 16,
            }}
            ref={cameraRef}
          />
          <SelectionPin coordinates={userPosition} />
        </MapboxGL.MapView>
      )}
    </View>
  );
};
