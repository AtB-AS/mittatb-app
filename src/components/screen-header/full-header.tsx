import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScreenHeader, {ScreenHeaderProps} from '.';
import {ThemeColor} from '@atb/theme/colors';

export type FullScreenHeaderProps = ScreenHeaderProps & {color?: ThemeColor};

export default function FullScreenHeader(props: FullScreenHeaderProps) {
  const style = useHeaderStyle();
  const {top} = useSafeAreaInsets();
  const {theme} = useTheme();
  const backgroundColor =
    props.color && theme.colors[props.color].backgroundColor;

  return (
    <View
      style={[
        style.background,
        props.style,
        {backgroundColor},
        {paddingTop: top},
      ]}
    >
      <ScreenHeader {...props} />
    </View>
  );
}

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  background: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
  },
}));
