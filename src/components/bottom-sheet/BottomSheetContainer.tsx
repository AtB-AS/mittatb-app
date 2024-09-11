import React, {ReactNode} from 'react';
import {
  //useWindowDimensions,
  View,
} from 'react-native';
import {BottomSheetHeader} from '@atb/components/bottom-sheet';

export type BottomSheetContainerProps = {
  children: ReactNode;
  _maxHeightValue?: number;
  _fullHeight?: boolean;
  testID?: string;
  title?: string;
  onClose?: () => void;
  focusTitleOnLoad?: boolean;
};

export function BottomSheetContainer({
  children,
  _maxHeightValue = 0.8,
  _fullHeight,
  testID,
  title,
  onClose,
  focusTitleOnLoad = true,
}: BottomSheetContainerProps) {
  //const {height: windowHeight} = useWindowDimensions();
  // const maxHeight = windowHeight * maxHeightValue;
  // const height = fullHeight ? maxHeight : 'auto'; // style={{height: windowHeight}}
  return (
    <View testID={testID}>
      <BottomSheetHeader
        onClose={onClose}
        title={title}
        focusTitleOnLoad={focusTitleOnLoad}
      />
      {children}
    </View>
  );
}
