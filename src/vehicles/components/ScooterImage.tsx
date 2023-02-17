import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Scooter} from '@atb/assets/svg/color/illustrations';

type Props = {
  style?: StyleProp<ViewStyle>;
};

// TODO: This component should get BrandAssetFragment as prop and show
// image from Entur as soon as the operators provide this.
export const ScooterImage = ({style}: Props) => (
  <View style={style}>
    <Scooter />
  </View>
);
