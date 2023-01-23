import React from 'react';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getVehicleSvg} from '@atb/components/vehicle-icon/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';

export type VehicleIconProps = {
  formFactor: FormFactor;
  disabled?: boolean;
};

export const VehicleIcon: React.FC<VehicleIconProps> = ({
  formFactor,
  disabled,
}) => {
  const {theme} = useTheme();
  const themeColor = useThemeColorForTransportMode(formFactor);
  const backgroundColor = disabled
    ? theme.text.colors.disabled
    : theme.static.transport[themeColor].background;
  const svg = getVehicleSvg(formFactor);
  const styles = useStyles();

  return (
    <View style={[styles.vehicleIcon, {backgroundColor}]}>
      <ThemeIcon svg={svg} colorType={themeColor} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  vehicleIcon: {
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.circle,
    marginRight: theme.spacings.xSmall,
  },
}));
