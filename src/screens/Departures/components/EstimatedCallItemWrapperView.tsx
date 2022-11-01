import {PlaceScreenMode} from '@atb/screens/Departures/PlaceScreen';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ReactNode} from 'react';

const EstimatedCallItemWrapperView = ({
  mode,
  onCallItemSelect,
  children,
}: {
  mode: PlaceScreenMode;
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
