import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {StyleSheet} from '@atb/theme';

export const ActivityIndicatorOverlay = () => {
  const styles = useStyles();
  return (
    <View style={styles.spinner}>
      <ActivityIndicator
        size="large"
        color={styles.activityIndicator.backgroundColor}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
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
    backgroundColor: theme.static.background['background_accent_0'].text,
  },
}));
