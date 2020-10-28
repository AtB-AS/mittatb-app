import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import colors from '../../theme/colors';
import {Add, Remove} from '../../assets/svg/icons/actions';
import {StyleSheet} from '../../theme';
import shadows from './shadows';
import ThemeIcon from '../theme-icon';

export type Props = {
  zoomIn(): void;
  zoomOut(): void;
};

const MapControls: React.FC<Props> = ({zoomIn, zoomOut}) => {
  const styles = useStyles();
  return (
    <View>
      <View style={styles.zoomContainer}>
        <TouchableOpacity
          onPress={zoomIn}
          accessibilityLabel="Zoom inn"
          accessibilityRole="button"
        >
          <View style={styles.zoomInButton}>
            <ThemeIcon svg={Add} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={zoomOut}
          accessibilityLabel="Zoom ut"
          accessibilityRole="button"
        >
          <View style={styles.zoomOutButton}>
            <ThemeIcon svg={Remove} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  zoomContainer: {
    backgroundColor: theme.background.level0,
    borderRadius: theme.border.borderRadius.small,
    ...shadows,
  },
  zoomInButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomOutButton: {
    width: 36,
    height: 36,
    borderTopColor: theme.border.primary,
    borderTopWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
export default MapControls;
