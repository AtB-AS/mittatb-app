import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {Map} from '@atb/assets/svg/mono-icons/map';

type ExternalMapButtonProps = {
  onPress: () => void;
};
export const ExternalMapButton = ({onPress}: ExternalMapButtonProps) => {
  const style = useStyle();

  return (
    <Button
      style={style.externalMapButton}
      type="medium"
      compact={true}
      interactiveColor="interactive_2"
      accessibilityRole="button"
      onPress={onPress}
      rightIcon={{svg: Map}}
      hasShadow={true}
    />
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  externalMapButton: {
    marginBottom: theme.spacings.small,
  },
}));
