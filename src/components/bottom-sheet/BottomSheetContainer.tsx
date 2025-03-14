import React, {ReactNode} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {BottomSheetHeader} from '@atb/components/bottom-sheet';
import {ScrollView} from 'react-native-gesture-handler';

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
  maxHeightValue = 0.8,
  fullHeight,
  testID,
  title,
  onClose,
  focusTitleOnLoad = true,
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
      />
      <ScrollView>{children}</ScrollView>
    </View>
  );
}
