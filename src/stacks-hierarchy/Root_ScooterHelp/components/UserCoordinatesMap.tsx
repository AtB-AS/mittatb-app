import {Coordinates} from '@atb/utils/coordinates';
import MapboxGL from '@rnmapbox/maps';
import {
  MapCameraConfig,
  SelectionPin,
  useMapViewConfig,
} from '@atb/components/map';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useRef} from 'react';

type Props = {
  userCoordinates: Coordinates | undefined;
  style?: StyleProp<ViewStyle>;
};
export const UserCoordinatesMap = ({userCoordinates, style}: Props) => {
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewConfig = useMapViewConfig();

  return (
    <View style={[{flex: 1}, style]}>
      {userCoordinates && (
        <MapboxGL.MapView
          {...mapViewConfig}
          compassEnabled={false}
          zoomEnabled={false}
          scrollEnabled={false}
          rotateEnabled={false}
          style={{flex: 1}}
        >
          <MapboxGL.Camera
            {...MapCameraConfig}
            defaultSettings={{
              centerCoordinate: [
                userCoordinates.longitude,
                userCoordinates.latitude,
              ],
              zoomLevel: 16,
            }}
            ref={cameraRef}
          />
          <SelectionPin coordinates={userCoordinates} />
        </MapboxGL.MapView>
      )}
    </View>
  );
};
