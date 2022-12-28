import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {StyleSheet} from '@atb/theme';

export const ActivityIndicatorOverlay = () => {
  const style = useStyles();
  return (
    <View style={style.spinner}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    opacity: 0.4,
  },
}));
