import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getGeofencingZoneKeyIconColor, getGeofencingZoneKeySvg} from './utils';
import {GeofencingZoneKeys} from '@atb-as/theme';

export type GeofencingZoneIconBoxProps = {
  geofencingZoneKey: GeofencingZoneKeys;
  size?: keyof Theme['icon']['size'];
  style?: StyleProp<ViewStyle>;
};

export const GeofencingZoneIconBox: React.FC<GeofencingZoneIconBoxProps> = ({
  geofencingZoneKey,
  size = 'small',
  style,
}) => {
  const {theme} = useThemeContext();
  const iconColor = getGeofencingZoneKeyIconColor(geofencingZoneKey, theme);
  const {svg} = getGeofencingZoneKeySvg(geofencingZoneKey);
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
