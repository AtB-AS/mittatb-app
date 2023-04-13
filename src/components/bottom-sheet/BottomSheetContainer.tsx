import React, {ReactNode} from 'react';
import {useWindowDimensions, View} from 'react-native';

export type BottomSheetContainerProps = {
  children: ReactNode;
  maxHeightValue?: number;
  fullHeight?: boolean;
  testID?: string;
};

export function BottomSheetContainer({
  children,
  maxHeightValue = 0.8,
  fullHeight,
  testID,
}: BottomSheetContainerProps) {
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * maxHeightValue;
  const height = fullHeight ? maxHeight : 'auto';
  return (
    <View style={{maxHeight, height}} testID={testID}>
      {children}
    </View>
  );
}
