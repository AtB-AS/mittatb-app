import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  getGeofencingZoneCodeIconColor,
  getGeofencingZoneCodeSvg,
} from './utils';
import {GeofencingZoneCode} from '@atb-as/theme';

export type GeofencingZoneIconBoxProps = {
  geofencingZoneCode: GeofencingZoneCode;
  size?: keyof Theme['icon']['size'];
  style?: StyleProp<ViewStyle>;
};

export const GeofencingZoneIconBox: React.FC<GeofencingZoneIconBoxProps> = ({
  geofencingZoneCode,
  size = 'small',
  style,
}) => {
  const {theme} = useThemeContext();
  const iconColor = getGeofencingZoneCodeIconColor(geofencingZoneCode, theme);
  const {svg} = getGeofencingZoneCodeSvg(geofencingZoneCode);
  const styles = useStyles();

  return (
    <View
      style={[
        styles.geofencingIconBox,
        style,
        {
          backgroundColor: iconColor.background,
        },
      ]}
    >
      <ThemeIcon size={size} svg={svg} color={iconColor.foreground.primary} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  geofencingIconBox: {
    padding: theme.spacing.xSmall,
    borderRadius: theme.border.radius.small,
  },
}));
