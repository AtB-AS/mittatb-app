import React from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import colors from '../../theme/colors';
import {Add, Remove} from '../../assets/svg/icons/actions';

export type Props = {
  flyToCurrentLocation(): void;
  zoomIn(): void;
  zoomOut(): void;
};

const shadows: ViewStyle = {
  shadowColor: colors.general.gray200,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowRadius: 8,
  elevation: 8,
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
            ...shadows,
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
            height: 36,
            justifyContent: 'center',
            alignItems: 'center',
            ...shadows,
          }}
        >
          <Add />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={zoomOut}>
        <View
          style={{
            backgroundColor: 'white',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            width: 36,
            height: 36,
            borderTopColor: colors.general.gray200,
            borderTopWidth: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            ...shadows,
          }}
        >
          <Remove />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MapControls;
