import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ReactNode} from 'react';
import {StopPlacesMode} from '@atb/screens/Departures/types';

const EstimatedCallItemWrapperView = ({
  mode,
  onCallItemSelect,
  children,
}: {
  mode: StopPlacesMode;
  children: ReactNode;
  onCallItemSelect?: () => void;
}) => {
  const styles = useStyles();
  return mode === 'Favourite' ? (
    <TouchableOpacity onPress={onCallItemSelect} style={styles.container}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={styles.container}>{children}</View>
  );
};

export {EstimatedCallItemWrapperView};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
}));
