import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import insets from '../../utils/insets';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import colors from '../../theme/colors';

export type Props = {
  flyToCurrentLocation(): void;
  zoomIn(): void;
  zoomOut(): void;
};

const MapControls: React.FC<Props> = ({
  flyToCurrentLocation,
  zoomIn,
  zoomOut,
}) => {
  return (
    <View>
      <TouchableOpacity onPress={flyToCurrentLocation}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            width: 36,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <CurrentLocationArrow />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={zoomIn}>
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            width: 36,
            height: 28,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>+</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={zoomOut}>
        <View
          style={{
            backgroundColor: 'white',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            width: 36,
            height: 28,
            borderTopColor: colors.general.gray200,
            borderTopWidth: 0.5,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>-</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MapControls;
