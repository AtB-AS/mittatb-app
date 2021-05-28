import {useTheme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScreenHeader, {ScreenHeaderProps} from '.';

export default function FullScreenHeader(props: ScreenHeaderProps) {
  const {top} = useSafeAreaInsets();
  const {theme} = useTheme();
  const themeColor = props.color ?? 'background_gray';
  const backgroundColor = theme.colors[themeColor].backgroundColor;

  return (
    <View style={[{backgroundColor}, {paddingTop: top}]}>
      <ScreenHeader {...props} />
    </View>
  );
}
