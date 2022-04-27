import {Add, Subtract} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations/';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import ThemeIcon from '@atb/components/theme-icon';
import shadows from './shadows';
export type Props = {
  zoomIn(): void;
  zoomOut(): void;
};

const MapControls: React.FC<Props> = ({zoomIn, zoomOut}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.zoomContainer}>
      <TouchableOpacity
        onPress={zoomIn}
        accessibilityLabel={t(MapTexts.controls.zoomIn.a11yLabel)}
        accessibilityRole="button"
      >
        <View style={styles.zoomInButton}>
          <ThemeIcon svg={Add} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={zoomOut}
        accessibilityLabel={t(MapTexts.controls.zoomOut.a11yLabel)}
        accessibilityRole="button"
      >
        <View style={styles.zoomOutButton}>
          <ThemeIcon svg={Subtract} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  zoomContainer: {
    backgroundColor: theme.static.background.background_1.background,
    borderRadius: theme.border.radius.small,
    alignContent: 'stretch',
    ...shadows,
  },
  zoomInButton: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomOutButton: {
    height: 36,
    borderTopColor: theme.border.primary,
    borderTopWidth: theme.border.width.slim,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
export default MapControls;
