import React, {ReactNode} from 'react';
import {ViewStyle} from 'react-native';
import {useWindowDimensions, View} from 'react-native';

export enum BottomSheetSize {
  auto = 0,
  compact = 0.5,
  cover = 0.8,
}

export type BottomSheetContainerProps = {
  children: ReactNode;
  sheetSize: BottomSheetSize;
  style?: ViewStyle;
};

export default function BottomSheetContainer({
  children,
  sheetSize,
  style,
}: BottomSheetContainerProps) {
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * sheetSize;
  const height = sheetSize > 0 ? maxHeight : 'auto';
  return <View style={[{maxHeight, height}, style]}>{children}</View>;
}
