import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import insets from '../../utils/insets';

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
            height: 20,
            width: 20,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>woop</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={zoomIn}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            height: 20,
            width: 20,

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
            borderRadius: 5,
            height: 20,
            width: 20,

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
