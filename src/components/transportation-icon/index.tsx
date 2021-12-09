import React from 'react';
import {View, StyleProp, ViewStyle, AccessibilityProps} from 'react-native';
import {
  BusSide,
  TramSide,
  TrainSide,
  PlaneSide,
  FerrySide,
  WalkingPerson,
} from '@atb/assets/svg/icons/transportation';
import {LegMode, TransportSubmode, TransportMode} from '@atb/sdk';
import {StyleSheet} from '@atb/theme';
import {SvgProps} from 'react-native-svg';
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {Mode as Mode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import {TransportSubmode as TransportSubMode_v2} from '@atb/api/types/generated/journey_planner_v3_types';

export type TransportationIconProps = {
  mode?: LegMode | TransportMode | Mode_v2;
  subMode?: TransportSubmode | TransportSubMode_v2;
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  subMode,
}) => {
  const {t} = useTranslation();
  const color = useTransportationColor(mode, subMode, 'color');
  const backgroundColor = useTransportationColor(
    mode,
    subMode,
    'backgroundColor',
  );
  const svg = getTransportModeSvg(mode);
  const styles = useStyles();

  return svg ? (
    <View style={[styles.transportationIcon, {backgroundColor}]}>
      <ThemeIcon
        svg={svg}
        fill={color}
        accessibilityLabel={t(getTranslatedModeName(mode))}
      />
    </View>
  ) : null;
};

export default TransportationIcon;

export function getTransportModeSvg(mode?: LegMode | TransportMode | Mode_v2) {
  switch (mode) {
    case 'bus':
    case 'coach':
      return BusSide;
    case 'tram':
      return TramSide;
    case 'rail':
      return TrainSide;
    case 'air':
      return PlaneSide;
    case 'water':
      return FerrySide;
    case 'foot':
      return WalkingPerson;
    default:
      return null;
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationIcon: {
    padding: 3,
    borderRadius: theme.border.radius.small,
  },
}));
