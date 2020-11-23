import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScreenHeader, {ScreenHeaderProps} from '.';
import {StyleSheet} from '../theme';

export default function FullScreenHeader(props: ScreenHeaderProps) {
  const style = useHeaderStyle();
  const {top} = useSafeAreaInsets();

  return (
    <View style={[style.background, {paddingTop: top}]}>
      <ScreenHeader {...props} />
    </View>
  );
}

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  background: {
    backgroundColor: theme.background.header,
  },
}));
