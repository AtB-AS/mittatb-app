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
  shadowColor: colors.general.black,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
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
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          ...shadows,
        }}
      >
        <TouchableOpacity onPress={zoomIn}>
          <View
            style={{
              width: 36,
              height: 36,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Add />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOut}>
          <View
            style={{
              width: 36,
              height: 36,
              borderTopColor: colors.general.gray200,
              borderTopWidth: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Remove />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapControls;
