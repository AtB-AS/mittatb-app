import MapboxGL from '@rnmapbox/maps';
import {Coordinates} from '@atb/utils/coordinates';
import {View} from 'react-native';
import {
  SelectionPinConfirm,
  SelectionPinShadow,
} from '@atb/assets/svg/color/map';
import {shadows} from './shadows';

type Props = {
  coordinates: Coordinates;
  id?: string;
};
export const SelectionPin = ({coordinates, id}: Props) => {
  return (
    <MapboxGL.PointAnnotation
      id={id ?? ''}
      coordinate={[coordinates.longitude, coordinates.latitude]}
    >
      <View style={shadows}>
        <SelectionPinConfirm width={40} height={40} />
        <SelectionPinShadow width={40} height={4} />
      </View>
    </MapboxGL.PointAnnotation>
  );
};
