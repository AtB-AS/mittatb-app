import {useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  LargeScreenHeader,
  LargeScreenHeaderProps,
  LargeScreenHeaderTop,
} from './LargeScreenHeader';
import {ScreenHeader, ScreenHeaderProps} from './ScreenHeader';

export function FullScreenHeader(props: ScreenHeaderProps) {
  const {top} = useSafeAreaInsets();
  const {themeName} = useTheme();
  const themeColor = props.color ?? 'background_accent_0';
  const backgroundColor = getStaticColor(themeName, themeColor).background;

  return (
    <View style={{backgroundColor, paddingTop: top}}>
      <ScreenHeader {...props} />
    </View>
  );
}

export function LargeFullScreenHeader(props: LargeScreenHeaderProps) {
  const {top} = useSafeAreaInsets();
  const {themeName} = useTheme();
  const themeColor = props.color ?? 'background_accent_0';
  const backgroundColor = getStaticColor(themeName, themeColor).background;

  return (
    <>
      <View style={{backgroundColor, paddingTop: top}}>
        <LargeScreenHeaderTop {...props.buttonProps} color={themeColor} />
      </View>
      <LargeScreenHeader {...props} />
    </>
  );
}
