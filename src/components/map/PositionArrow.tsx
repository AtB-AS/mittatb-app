import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import {StyleSheet} from '../../theme';
import shadows from './shadows';
import ThemeIcon from '../theme-icon';

const PositionArrow: React.FC<{flyToCurrentLocation(): void}> = ({
  flyToCurrentLocation,
}) => {
  const styles = useStyles();
  return (
    <TouchableOpacity
      accessibilityLabel="Min posisjon"
      accessibilityRole="button"
      onPress={flyToCurrentLocation}
    >
      <View style={styles.flyToButton}>
        <ThemeIcon svg={CurrentLocationArrow} />
      </View>
    </TouchableOpacity>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  flyToButton: {
    backgroundColor: theme.background.level0,
    borderRadius: theme.border.radius.small,
    width: 36,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacings.small,
    ...shadows,
  },
}));
export default PositionArrow;
