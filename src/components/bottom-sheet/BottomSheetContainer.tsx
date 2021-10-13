import React, {ReactNode} from 'react';
import {useWindowDimensions, View} from 'react-native';

export default function BottomSheetContainer({
  children,
  fullHeight,
}: {
  children: ReactNode;
  fullHeight?: boolean;
}) {
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * 0.8;
  const height = fullHeight ? maxHeight : 'auto';
  return <View style={{maxHeight, height}}>{children}</View>;
}
