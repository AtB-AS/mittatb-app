import {Location} from '@atb/assets/svg/mono-icons/places';
import {StyleSheet} from '@atb/theme';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import {Button} from '@atb/components/button';

export const PositionArrow: React.FC<
  {onPress(): void} & AccessibilityProps
> = ({onPress}) => {
  const styles = useStyles();

  return (
    <Button
      type="medium"
      compact={true}
      interactiveColor="interactive_2"
      onPress={onPress}
      hitSlop={insets.symmetric(12, 20)}
      leftIcon={{svg: Location}}
      style={styles.flyToButton}
      hasShadow={true}
    />
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  flyToButton: {
    marginBottom: theme.spacings.small,
  },
}));
