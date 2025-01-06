import {useThemeContext} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from './ScreenHeader';

export function FullScreenHeader(props: ScreenHeaderProps) {
  const {top} = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const themeColor = props.color ?? theme.color.background.accent[0];
  const backgroundColor = themeColor.background;

  return (
    <View style={{backgroundColor, paddingTop: top}}>
      <ScreenHeader {...props} />
    </View>
  );
}
