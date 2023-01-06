import {Add, Subtract} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations/';
import React from 'react';
import {View} from 'react-native';
import {shadows} from './shadows';
import {Button} from '@atb/components/button';

export type Props = {
  zoomIn(): void;
  zoomOut(): void;
};

export const MapControls: React.FC<Props> = ({zoomIn, zoomOut}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.zoomContainer}>
      <Button
        type="inline"
        compact={true}
        interactiveColor="interactive_2"
        accessibilityRole="button"
        accessibilityLabel={t(MapTexts.controls.zoomIn.a11yLabel)}
        onPress={zoomIn}
        leftIcon={{svg: Add}}
      />
      <Button
        type="inline"
        compact={true}
        interactiveColor="interactive_2"
        accessibilityRole="button"
        accessibilityLabel={t(MapTexts.controls.zoomOut.a11yLabel)}
        onPress={zoomOut}
        leftIcon={{svg: Subtract}}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  zoomContainer: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.small,
    alignContent: 'stretch',
    ...shadows,
  },
}));
