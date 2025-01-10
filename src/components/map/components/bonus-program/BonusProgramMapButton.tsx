import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useAnalyticsContext} from '@atb/analytics';
import {FavoriteFill} from '@atb/assets/svg/mono-icons/places';

type BonusProgramMapButtonProps = {
  onPress: () => void;
  isLoading: boolean;
  bonusPoints: number;
};
export const BonusProgramMapButton = ({
  onPress,
  isLoading,
  bonusPoints,
}: BonusProgramMapButtonProps) => {
  const style = useStyle();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const analytics = useAnalyticsContext();

  return (
    <Button
      expanded={false}
      style={style.bonusProgramButton}
      compact={true}
      interactiveColor={interactiveColor}
      accessibilityRole="button"
      onPress={() => {
        analytics.logEvent('Map', 'Bonus Program button clicked');
        onPress();
      }}
      loading={isLoading}
      rightIcon={{svg: FavoriteFill}} // TODO: update icon
      hasShadow={true}
      testID="mapBonusProgran"
      text={bonusPoints.toString()}
    />
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  bonusProgramButton: {
    marginBottom: theme.spacing.small,
  },
}));
