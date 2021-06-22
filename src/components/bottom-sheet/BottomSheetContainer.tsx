import React, {ReactNode} from 'react';
import {useWindowDimensions, View} from 'react-native';

export default function BottomSheetContainer({
  children,
}: {
  children: ReactNode;
}) {
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * 0.8;
  return <View style={{maxHeight}}>{children}</View>;
}
