import React, {ReactNode} from 'react';
import {ViewStyle} from 'react-native';
import {useWindowDimensions, View} from 'react-native';

export type BottomSheetContainerProps = {
  children: ReactNode;
  maxHeightValue?: number;
  fullHeight?: boolean;
};

export default function BottomSheetContainer({
  children,
  maxHeightValue = 0.8,
  fullHeight,
}: BottomSheetContainerProps) {
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * maxHeightValue;
  const height = fullHeight ? maxHeight : 'auto';
  return <View style={[{maxHeight, height}]}>{children}</View>;
}
