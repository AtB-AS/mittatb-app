import {StyleSheet} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScreenHeader, {ScreenHeaderProps} from '.';

export default function FullScreenHeader(props: ScreenHeaderProps) {
  const style = useHeaderStyle();
  const {top} = useSafeAreaInsets();

  return (
    <View style={[style.background, props.style, {paddingTop: top}]}>
      <ScreenHeader {...props} />
    </View>
  );
}

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  background: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
  },
}));
