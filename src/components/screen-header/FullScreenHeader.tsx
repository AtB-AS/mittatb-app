import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from './ScreenHeader';

export function FullScreenHeader(props: ScreenHeaderProps) {
  const {top} = useSafeAreaInsets();

  return (
    <View style={{paddingTop: top}}>
      <ScreenHeader {...props} />
    </View>
  );
}
