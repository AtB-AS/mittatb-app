import {Location} from '@atb/assets/svg/mono-icons/places';
import {StyleSheet} from '@atb/theme';
import insets from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import Button from '@atb/components/button';
import shadows from './shadows';

const PositionArrow: React.FC<
  {flyToCurrentLocation(): void} & AccessibilityProps
> = ({flyToCurrentLocation}) => {
  const styles = useStyles();

  return (
    <Button
      type="compact"
      color="primary_2"
      onPress={flyToCurrentLocation}
      hitSlop={insets.symmetric(12, 20)}
      icon={Location}
      style={styles.flyToButton}
    />
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  flyToButton: {
    marginBottom: theme.spacings.small,
    ...shadows,
  },
}));
export default PositionArrow;
