import React, {ReactNode} from 'react';
import {useWindowDimensions, View} from 'react-native';

export type BottomSheetContainerProps = {
  children: ReactNode;
  maxHeightValue?: number;
  fullHeight?: boolean;
};

export function BottomSheetContainer({
  children,
  maxHeightValue = 0.8,
  fullHeight,
}: BottomSheetContainerProps) {
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * maxHeightValue;
  const height = fullHeight ? maxHeight : 'auto';
  return <View style={{maxHeight, height}}>{children}</View>;
}
