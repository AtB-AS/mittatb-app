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
};

export function BottomSheetContainer({
  children,
  testID,
  title,
  onClose,
  focusTitleOnLoad = true,
}: BottomSheetContainerProps) {
  const {height: windowHeight} = useWindowDimensions();
  return (
    <View testID={testID} style={{height: windowHeight}}>
      <BottomSheetHeader
        onClose={onClose}
        title={title}
        focusTitleOnLoad={focusTitleOnLoad}
      />
      {children}
    </View>
  );
}
