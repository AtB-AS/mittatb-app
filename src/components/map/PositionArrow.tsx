import React from 'react';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import Button from '../button';
import shadows from './shadows';

const PositionArrow: React.FC<{flyToCurrentLocation(): void}> = ({
  flyToCurrentLocation,
}) => {
  const styles = useStyles();
  return (
    <Button
      type="compact"
      mode="primary"
      accessibilityLabel="Min posisjon"
      accessibilityRole="button"
      onPress={flyToCurrentLocation}
      hitSlop={insets.symmetric(12, 20)}
      icon={CurrentLocationArrow}
      style={styles.flyToButton}
    ></Button>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  flyToButton: {
    marginBottom: theme.spacings.small,
    ...shadows,
  },
}));
export default PositionArrow;
