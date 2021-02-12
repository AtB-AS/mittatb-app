import {Add, Remove} from '@atb/assets/svg/icons/actions';
import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations/';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import ThemeIcon from '../theme-icon';
import shadows from './shadows';
export type Props = {
  zoomIn(): void;
  zoomOut(): void;
};

const MapControls: React.FC<Props> = ({zoomIn, zoomOut}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View>
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
    borderRadius: theme.border.radius.small,
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
