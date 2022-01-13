import React from 'react';
import {View} from 'react-native';
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
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {
  Mode as Mode_v2,
  TransportMode as TransportMode_v2,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {TransportSubmode as TransportSubMode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import ThemeText from '@atb/components/text';
import {textTypeStyles} from '@atb/theme/colors';

export type AnyMode = LegMode | Mode_v2 | TransportMode | TransportMode_v2;
export type AnySubMode = TransportSubmode | TransportSubMode_v2;

export type TransportationIconProps = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  lineNumber?: string;
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  subMode,
  lineNumber,
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

  const lineNumberElement = lineNumber ? (
    <ThemeText>{lineNumber}</ThemeText>
  ) : null;

  return svg ? (
    <View style={[styles.transportationIcon, {backgroundColor}]}>
      <ThemeIcon
        style={styles.lineNumber}
        svg={svg}
        fill={color}
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
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacings.xSmall,
    paddingRight: theme.spacings.small,
    paddingLeft: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
    marginHorizontal: theme.spacings.xSmall,
  },
  lineNumber: {
    marginHorizontal: theme.spacings.xSmall,
    fontWeight: textTypeStyles['body__primary--bold'].fontWeight,
  },
}));
