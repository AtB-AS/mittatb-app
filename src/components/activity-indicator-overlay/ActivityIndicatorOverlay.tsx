import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Loading} from '../loading';

export const ActivityIndicatorOverlay = () => {
  const styles = useStyles();
  return (
    <View style={styles.spinner}>
      <Loading size="large" color={styles.activityIndicator.backgroundColor} />
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
  activityIndicator: {
    backgroundColor: 'white',
  },
}));
