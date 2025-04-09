import React, {ReactNode} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {BottomSheetHeader} from '@atb/components/bottom-sheet';

export type BottomSheetContainerProps = {
  children: ReactNode;
  maxHeightValue?: number;
  fullHeight?: boolean;
  testID?: string;
  title?: string;
  onClose?: () => void;
  focusTitleOnLoad?: boolean;
  disableClose?: boolean;
};

export function BottomSheetContainer({
  children,
  maxHeightValue = 0.8,
  fullHeight,
  testID,
  title,
  onClose,
  focusTitleOnLoad = true,
  disableClose = false,
}: BottomSheetContainerProps) {
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * maxHeightValue;
  const height = fullHeight ? maxHeight : 'auto';
  return (
    <View style={{maxHeight, height}} testID={testID}>
      <BottomSheetHeader
        onClose={onClose}
        title={title}
        focusTitleOnLoad={focusTitleOnLoad}
        disableClose={disableClose}
      />
      {children}
    </View>
  );
}
