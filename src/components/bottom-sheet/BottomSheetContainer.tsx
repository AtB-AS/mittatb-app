import React, {ReactNode} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {BottomSheetHeader} from '@atb/components/bottom-sheet';

export type BottomSheetContainerProps = {
  children: ReactNode;
  maxHeightValue?: number;
  fullHeight?: boolean;
  testID?: string;
  bottomSheetTitle?: string;
  closeBottomSheet?: () => void;
};

export function BottomSheetContainer({
  children,
  maxHeightValue = 0.8,
  fullHeight,
  testID,
  bottomSheetTitle,
  closeBottomSheet,
}: BottomSheetContainerProps) {
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * maxHeightValue;
  const height = fullHeight ? maxHeight : 'auto';
  return (
    <View style={{maxHeight, height}} testID={testID}>
      <BottomSheetHeader
        closeBottomSheet={closeBottomSheet}
        title={bottomSheetTitle}
      />
      {children}
    </View>
  );
}
