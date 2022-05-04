import React from 'react';
import {View} from 'react-native';

import * as TransportIcons from '@atb/assets/svg/mono-icons/transportation';
import * as EnturTransportIcons from '@atb/assets/svg/mono-icons/transportation-entur';
import {LegMode, TransportSubmode, TransportMode} from '@atb/sdk';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {
  Mode as Mode_v2,
  TransportMode as TransportMode_v2,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {TransportSubmode as TransportSubMode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import ThemeText from '@atb/components/text';
import {iconSizes} from '@atb-as/theme';

export type AnyMode = LegMode | Mode_v2 | TransportMode | TransportMode_v2;
export type AnySubMode = TransportSubmode | TransportSubMode_v2;

export type TransportationIconProps = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  lineNumber?: string;
  size?: keyof Theme['icon']['size'];
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  subMode,
  lineNumber,
  size = 'normal',
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = useThemeColorForTransportMode(mode, subMode);
  const backgroundColor = theme.static.transport[themeColor].background;
  const svg = getTransportModeSvg(mode);
  const styles = useStyles();

  const iconStyle =
    size == 'small'
      ? styles.transportationIcon_small
      : styles.transportationIcon;

  const lineNumberElement = lineNumber ? (
    <ThemeText
      type="body__primary--bold"
      color={themeColor}
      style={styles.lineNumberText}
    >
      {lineNumber}
    </ThemeText>
  ) : null;

  return svg ? (
    <View style={[iconStyle, {backgroundColor}]}>
      <ThemeIcon
        size={size}
        svg={svg}
        colorType={themeColor}
        accessibilityLabel={t(getTranslatedModeName(mode))}
      />
      {lineNumberElement}
    </View>
  ) : null;
};

export default TransportationIcon;

export function getTransportModeSvg(mode?: AnyMode) {
  switch (mode) {
    case 'bus':
    case 'coach':
      return TransportIcons.Bus;
    case 'tram':
      return TransportIcons.Tram;
    case 'rail':
      return TransportIcons.Train;
    case 'air':
      return EnturTransportIcons.Plane;
    case 'water':
      return TransportIcons.Boat;
    case 'foot':
      return TransportIcons.Walk;
    case 'metro':
      return EnturTransportIcons.Subway;
    default:
      return null;
  }
}

export const CollapsedLegs = ({legs}: {legs: any[]}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const backgroundColor = theme.static.transport.transport_other.background;

  if (!legs.length) return null;

  return (
    <View style={[styles.transportationIcon, {backgroundColor}]}>
      <ThemeText
        color={'transport_other'}
        style={styles.lineNumberText}
        type="body__primary--bold"
        testID="collapsedLegs"
      >
        +{legs.length}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationIcon: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.small,
    marginRight: theme.spacings.xSmall,
  },
  transportationIcon_small: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacings.xSmall,
    paddingHorizontal: theme.spacings.xSmall,
    borderRadius: theme.border.radius.small,
    marginRight: theme.spacings.xSmall,
  },
  lineNumberText: {
    marginLeft: theme.spacings.xSmall,
  },
}));
