import {View} from 'react-native';
import {Processing} from '@atb/components/loading';
import React from 'react';
import {StyleSheet} from '@atb/theme';

/** Loading overlay which covers the web view until it is finished loading */
export const LoadingOverlay = ({text}: {text: string}) => {
  const styles = useStyles();
  return (
    <View style={styles.loadingOverlay}>
      <Processing message={text} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  loadingOverlay: {
    backgroundColor: theme.static.background.background_1.background,
    zIndex: 100,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacings.medium,
  },
}));
