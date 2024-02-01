import React from 'react';
import {View} from 'react-native';
import {shadows} from '@atb/components/map';
import {StyleSheet} from '@atb/theme';

export const ShadowWrapper: React.FC = ({children}) => {
  const style = useStyle();

  return <View style={[shadows, style.shadowContainer]}>{children}</View>;
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  shadowContainer: {
    backgroundColor: 'white',
    borderRadius: theme.border.radius.regular,
  },
}));
