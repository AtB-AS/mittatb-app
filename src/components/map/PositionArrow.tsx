import {CurrentLocationArrow} from '@atb/assets/svg/icons/places';
import {StyleSheet} from '@atb/theme';
import insets from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import Button from '../button';
import shadows from './shadows';

const PositionArrow: React.FC<
  {flyToCurrentLocation(): void} & AccessibilityProps
> = ({flyToCurrentLocation}) => {
  const styles = useStyles();

  return (
    <Button
      type="compact"
      mode="primary"
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
