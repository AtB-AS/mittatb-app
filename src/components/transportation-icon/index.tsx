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
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type TransportationIconProps = {
  mode?: LegMode | TransportMode;
  subMode?: TransportSubmode;
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  subMode,
}) => {
  const {t} = useTranslation();
  const color = useTransportationColor(mode, subMode);
  const svg = getTransportModeSvg(mode);

  return svg ? (
    <View>
      <ThemeIcon
        svg={svg}
        fill={color}
        accessibilityLabel={t(getTranslatedModeName(mode))}
      />
    </View>
  ) : null;
};

export default TransportationIcon;

export function getTransportModeSvg(
  mode?: LegMode | TransportMode | Types.TransportMode,
) {
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
